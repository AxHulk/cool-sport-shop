// Inventory reservation lifecycle: reserved on order creation,
// deducted on confirmed payment, released on failure/timeout.
// deno-lint-ignore no-explicit-any
export async function settleStock(supabase: any, orderId: string, mode: "deduct" | "release") {
  const next = mode === "deduct" ? "deducted" : "released";
  // Atomic claim: only one caller moves an order out of 'reserved'
  const { data: claimed } = await supabase
    .from("orders").update({ stock_state: next })
    .eq("id", orderId).eq("stock_state", "reserved").select("id");
  if (!claimed || claimed.length === 0) return false;

  const { data: items } = await supabase
    .from("order_items").select("product_id, size, color, quantity").eq("order_id", orderId);
  for (const it of items ?? []) {
    const { data: inv } = await supabase.from("products_inventory")
      .select("id, quantity, reserved")
      .eq("product_id", it.product_id).eq("size", it.size).eq("color", it.color).maybeSingle();
    if (!inv) continue;
    const upd: Record<string, number> = { reserved: Math.max(0, inv.reserved - it.quantity) };
    if (mode === "deduct") upd.quantity = Math.max(0, inv.quantity - it.quantity);
    await supabase.from("products_inventory").update(upd).eq("id", inv.id);
  }
  return true;
}
