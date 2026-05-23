ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_id text,
  ADD COLUMN IF NOT EXISTS payment_status text;

CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON public.orders(payment_id);