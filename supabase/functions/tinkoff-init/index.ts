// Edge function: creates a payment in T-Kassa (Tinkoff) and returns PaymentURL.
// Customer is then redirected to T-Kassa form where Dolyame is one of the methods.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { createHash } from "node:crypto";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InitItem {
  name: string;
  quantity: number;
  /** total price for line (rubles) */
  amount: number;
}

interface InitPayload {
  order_number: string;
  /** total amount in rubles */
  amount: number;
  customer_email: string;
  customer_phone: string;
  items: InitItem[];
  /** preferred method shown on T-Kassa form */
  payment_method?: "card" | "sbp" | "dolyami" | string;
  success_url?: string;
  fail_url?: string;
}

const TERMINAL_KEY = Deno.env.get("TINKOFF_TERMINAL_KEY")!;
const PASSWORD = Deno.env.get("TINKOFF_PASSWORD")!;
const TINKOFF_API = "https://securepay.tinkoff.ru/v2/Init";

/** T-Kassa token: sha256 of concatenated values of all root-level scalar fields + Password, sorted alphabetically by key */
function makeToken(payload: Record<string, unknown>): string {
  const entries: [string, string][] = [];
  for (const [k, v] of Object.entries(payload)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue; // skip Receipt, DATA, etc.
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
    if (!TERMINAL_KEY || !PASSWORD) {
      return new Response(JSON.stringify({ error: "Tinkoff credentials missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: InitPayload = await req.json();

    if (!body.order_number || !body.amount || !body.items?.length) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const amountKopecks = Math.round(body.amount * 100);

    // Build Receipt (54-FZ — required for Dolyame)
    const receipt = {
      Email: body.customer_email,
      Phone: body.customer_phone,
      Taxation: "usn_income",
      Items: body.items.map((it) => {
        const lineAmount = Math.round(it.amount * 100);
        const unitPrice = Math.round(lineAmount / it.quantity);
        return {
          Name: it.name.slice(0, 128),
          Price: unitPrice,
          Quantity: it.quantity,
          Amount: lineAmount,
          Tax: "none",
          PaymentMethod: "full_payment",
          PaymentObject: "commodity",
        };
      }),
    };

    // Normalize receipt sum to amountKopecks (rounding fix)
    const receiptSum = receipt.Items.reduce((s, i) => s + i.Amount, 0);
    if (receiptSum !== amountKopecks && receipt.Items.length > 0) {
      receipt.Items[0].Amount += amountKopecks - receiptSum;
      receipt.Items[0].Price = Math.round(receipt.Items[0].Amount / receipt.Items[0].Quantity);
    }

    const projectId = Deno.env.get("SUPABASE_URL")?.match(/https:\/\/([^.]+)/)?.[1];
    const notificationURL = `https://${projectId}.supabase.co/functions/v1/tinkoff-webhook`;

    const initPayload: Record<string, unknown> = {
      TerminalKey: TERMINAL_KEY,
      Amount: amountKopecks,
      OrderId: body.order_number,
      Description: `Заказ №${body.order_number}`,
      NotificationURL: notificationURL,
    };
    // SuccessURL передаём только если явно задан — иначе Т-Банк показывает свой финальный экран "Оплачено"
    if (body.success_url) initPayload.SuccessURL = body.success_url;
    if (body.fail_url) initPayload.FailURL = body.fail_url;

    // Token from scalar fields + Password
    initPayload.Token = makeToken(initPayload);
    // Attach non-scalar fields after token calc
    initPayload.Receipt = receipt;

    // Hint Dolyame as the default method on T-Kassa form
    if (body.payment_method === "dolyami") {
      initPayload.DATA = { PaymentMethod: "dolyame" };
    }

    const tinkoffRes = await fetch(TINKOFF_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(initPayload),
    });

    const data = await tinkoffRes.json();

    if (!data.Success) {
      console.error("Tinkoff Init failed:", data);
      return new Response(
        JSON.stringify({
          error: data.Message || data.Details || "Tinkoff Init failed",
          code: data.ErrorCode,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Store PaymentId on order
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await supabase
        .from("orders")
        .update({
          payment_id: String(data.PaymentId),
          payment_status: data.Status || "NEW",
        })
        .eq("order_number", body.order_number);
    } catch (e) {
      console.error("Failed to store payment_id:", e);
    }

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: data.PaymentId,
        payment_url: data.PaymentURL,
        status: data.Status,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("tinkoff-init error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
