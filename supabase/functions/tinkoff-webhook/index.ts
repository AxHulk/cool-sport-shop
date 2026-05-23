// Edge function: receives payment status notifications from T-Kassa.
// Verifies Token, updates order.payment_status and order.status accordingly.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { createHash } from "node:crypto";

const PASSWORD = Deno.env.get("TINKOFF_PASSWORD")!;

function verifyToken(payload: Record<string, unknown>): boolean {
  const { Token, ...rest } = payload as { Token?: string };
  if (!Token) return false;
  const entries: [string, string][] = [];
  for (const [k, v] of Object.entries(rest)) {
    if (v === null || v === undefined) continue;
    if (typeof v === "object") continue;
    // Tinkoff sends booleans as 'true'/'false' strings in token calc
    entries.push([k, typeof v === "boolean" ? String(v) : String(v)]);
  }
  entries.push(["Password", PASSWORD]);
  entries.sort((a, b) => a[0].localeCompare(b[0]));
  const concat = entries.map((e) => e[1]).join("");
  const expected = createHash("sha256").update(concat).digest("hex");
  return expected === Token;
}

/** Map T-Kassa payment status → internal order status */
function mapOrderStatus(tinkoffStatus: string): string | null {
  switch (tinkoffStatus) {
    case "CONFIRMED":
    case "AUTHORIZED":
      return "paid";
    case "REJECTED":
    case "DEADLINE_EXPIRED":
    case "CANCELED":
    case "REVERSED":
    case "REFUNDED":
    case "PARTIAL_REFUNDED":
      return "cancelled";
    default:
      return null; // NEW/FORM_SHOWED/AUTHORIZING etc. — keep current
  }
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    console.log("Tinkoff webhook:", JSON.stringify(body));

    if (!verifyToken(body)) {
      console.error("Token verification failed");
      return new Response("BAD_TOKEN", { status: 400 });
    }

    const orderId: string = body.OrderId;
    const paymentId: string = String(body.PaymentId ?? "");
    const status: string = body.Status;

    if (!orderId) return new Response("OK");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const update: Record<string, unknown> = {
      payment_status: status,
      payment_id: paymentId || undefined,
    };
    const mapped = mapOrderStatus(status);
    if (mapped) update.status = mapped;

    const { data: existing } = await supabase
      .from("orders")
      .select("id, status")
      .eq("order_number", orderId)
      .maybeSingle();

    if (existing) {
      await supabase.from("orders").update(update).eq("id", existing.id);
      if (mapped && existing.status !== mapped) {
        await supabase.from("order_history").insert({
          order_id: existing.id,
          field_changed: "status",
          old_value: existing.status,
          new_value: mapped,
          changed_by: "tinkoff",
        });
      }
    }

    // T-Kassa expects literal "OK"
    return new Response("OK");
  } catch (e) {
    console.error("tinkoff-webhook error:", e);
    return new Response("ERROR", { status: 500 });
  }
});
