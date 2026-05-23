-- Lock down public SELECT on sensitive tables (admin reads via edge function with service role)
DROP POLICY IF EXISTS "Allow read access" ON public.customers;
DROP POLICY IF EXISTS "Allow read access" ON public.orders;
DROP POLICY IF EXISTS "Allow read access" ON public.order_items;
DROP POLICY IF EXISTS "Allow read access" ON public.order_history;
DROP POLICY IF EXISTS "Allow read access" ON public.returns;

-- Replace with explicit service-role-only SELECT policies (clear intent; service role bypasses RLS anyway)
CREATE POLICY "Service role can read customers"
  ON public.customers FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read orders"
  ON public.orders FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read order_items"
  ON public.order_items FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read order_history"
  ON public.order_history FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can read returns"
  ON public.returns FOR SELECT
  USING (auth.role() = 'service_role');

-- Harden SECURITY DEFINER pgmq helpers: pin search_path and revoke from public/anon/authenticated
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public, pgmq;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public, pgmq;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public, pgmq;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public, pgmq;

REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;