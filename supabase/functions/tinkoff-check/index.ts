// Polls T-Kassa GetState for recent unfinished payments and updates orders.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { createHash } from "node:crypto";
import { tinkoffFetch } from "../_shared/russian-ca.ts";
import { mapPaymentResult, notifyPaymentStatus } from "../_shared/payment-notify.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TERMINAL_KEY = Deno.env.get("TINKOFF_TERMINAL_KEY")!;
const PASSWORD = Deno.env.get("TINKOFF_PASSWORD")!;
const FINAL = ["CONFIRMED", "AUTHORIZED", "REJECTED", "DEADLINE_EXPIRED", "CANCELED", "REVERSED", "REFUNDED", "PARTIAL_REFUNDED", "AUTH_FAIL"];

function token(p: Record<string, string>) {
  const e = Object.entries({ ...p, Password: PASSWORD }).sort((a, b) => a[0].localeCompare(b[0]));
  return createHash("sha256").update(e.map((x) => x[1]).join("")).digest("hex");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

  const since = new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString();
  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, order_number, customer_name, customer_email, total_price, delivery_price, payment_id, payment_status")
    .not("payment_id", "is", null)
    .gte("created_at", since)
    .limit(100);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const results: unknown[] = [];
  for (const o of (orders ?? []).filter((o) => !FINAL.includes(o.payment_status ?? ""))) {
    try {
      const body = { TerminalKey: TERMINAL_KEY, PaymentId: String(o.payment_id) };
      const res = await tinkoffFetch("https://securepay.tinkoff.ru/v2/GetState", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, Token: token(body) }),
      });
      const data = await res.json();
      if (!data.Success) {
        results.push({ order: o.order_number, error: data.Message || data.ErrorCode });
        continue;
      }
      const status: string = data.Status;
      if (status !== o.payment_status) {
        await supabase.from("orders").update({ payment_status: status }).eq("id", o.id);
        const result = mapPaymentResult(status);
        if (result) {
          await supabase.from("order_history").insert({
            order_id: o.id, field_changed: "payment_status",
            old_value: o.payment_status, new_value: status, changed_by: "tinkoff-check",
          });
          await notifyPaymentStatus(supabase, o, result, status);
        }
      }
      results.push({ order: o.order_number, status });
    } catch (e) {
      results.push({ order: o.order_number, error: (e as Error).message });
    }
  }

  return new Response(JSON.stringify({ checked: results.length, results }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
