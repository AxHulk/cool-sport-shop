// Edge function: creates a NEW T-Kassa payment for an existing order.
// Used when the previous payment was rejected / abandoned (typical with Долями).
// Each retry gets a fresh OrderId suffix (-r2, -r3...) — Т-Касса требует уникальный OrderId.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TERMINAL_KEY = Deno.env.get("TINKOFF_TERMINAL_KEY")!;
const PASSWORD = Deno.env.get("TINKOFF_PASSWORD")!;
const TINKOFF_API = "https://securepay.tinkoff.ru/v2/Init";

function makeToken(payload: Record<string, unknown>): string {
  const entries: [string, string][] = [];
  for (const [k, v] of Object.entries(payload)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue;
    entries.push([k, String(v)]);
  }
  entries.push(["Password", PASSWORD]);
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  const concat = entries.map((e) => e[1]).join("");
  return createHash("sha256").update(concat).digest("hex");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { order_number, payment_method } = await req.json();
    if (!order_number) {
      return new Response(JSON.stringify({ error: "order_number required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Базовый order_number (без суффикса -rN)
    const baseOrderNumber = String(order_number).split("-r")[0];

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, order_number, customer_email, customer_phone, total_price, delivery_price, payment_method, status")
      .eq("order_number", baseOrderNumber)
      .maybeSingle();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Заказ не найден" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (order.status === "paid") {
      return new Response(JSON.stringify({ error: "Заказ уже оплачен" }), {
        status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: items, error: itemsErr } = await supabase
      .from("order_items")
      .select("product_name, quantity, price")
      .eq("order_id", order.id);

    if (itemsErr || !items || items.length === 0) {
      return new Response(JSON.stringify({ error: "Позиции заказа не найдены" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const method = payment_method || order.payment_method;
    const totalRub = Number(order.total_price) + Number(order.delivery_price || 0);
    const amountKopecks = Math.round(totalRub * 100);

    // Уникальный OrderId для Т-Кассы: <base>-rN, где N — следующий по счёту
    // Найдём максимальный текущий суффикс по payment_id/обращениям — проще: timestamp короткий
    const retrySuffix = Math.floor(Date.now() / 1000) % 100000; // 5 цифр
    const newOrderId = `${baseOrderNumber}-r${retrySuffix}`;

    const receiptItems = items.map((it) => {
      const lineAmount = Math.round(Number(it.price) * 100);
      const unitPrice = Math.round(lineAmount / it.quantity);
      return {
        Name: String(it.product_name).slice(0, 128),
        Price: unitPrice,
        Quantity: it.quantity,
        Amount: lineAmount,
        Tax: "none",
        PaymentMethod: "full_payment",
        PaymentObject: "commodity",
      };
    });

    // Добавим строку доставки, если есть
    if (Number(order.delivery_price) > 0) {
      const dAmount = Math.round(Number(order.delivery_price) * 100);
      receiptItems.push({
        Name: "Доставка СДЭК",
        Price: dAmount,
        Quantity: 1,
        Amount: dAmount,
        Tax: "none",
        PaymentMethod: "full_payment",
        PaymentObject: "service",
      });
    }

    // Подгон под общую сумму
    const receiptSum = receiptItems.reduce((s, i) => s + i.Amount, 0);
    if (receiptSum !== amountKopecks && receiptItems.length > 0) {
      receiptItems[0].Amount += amountKopecks - receiptSum;
      receiptItems[0].Price = Math.round(receiptItems[0].Amount / receiptItems[0].Quantity);
    }

    const receipt = {
      Email: order.customer_email,
      Phone: order.customer_phone,
      Taxation: "usn_income",
      Items: receiptItems,
    };

    const projectId = Deno.env.get("SUPABASE_URL")?.match(/https:\/\/([^.]+)/)?.[1];
    const notificationURL = `https://${projectId}.supabase.co/functions/v1/tinkoff-webhook`;

    const initPayload: Record<string, unknown> = {
      TerminalKey: TERMINAL_KEY,
      Amount: amountKopecks,
      OrderId: newOrderId,
      Description: `Заказ №${baseOrderNumber} (повторная оплата)`,
      NotificationURL: notificationURL,
    };
    initPayload.Token = makeToken(initPayload);
    initPayload.Receipt = receipt;

    if (method === "dolyami") initPayload.DATA = { PaymentMethod: "dolyame" };
    else if (method === "sbp") initPayload.DATA = { PaymentMethod: "sbp" };

    const tinkoffRes = await fetch(TINKOFF_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initPayload),
    });
    const data = await tinkoffRes.json();

    if (!data.Success) {
      console.error("Tinkoff retry Init failed:", data);
      return new Response(JSON.stringify({
        error: data.Message || data.Details || "Tinkoff Init failed",
        code: data.ErrorCode,
      }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Обновим payment_id/статус и method у заказа
    await supabase.from("orders").update({
      payment_id: String(data.PaymentId),
      payment_status: data.Status || "NEW",
      payment_method: method,
    }).eq("id", order.id);

    // Маппинг новый OrderId → базовый: webhook ищет по order_number, но Т-Касса вернёт newOrderId.
    // Поэтому надо сделать webhook толерантным к суффиксу. Делается в tinkoff-webhook.

    return new Response(JSON.stringify({
      success: true,
      payment_id: data.PaymentId,
      payment_url: data.PaymentURL,
      status: data.Status,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("tinkoff-retry error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
