DROP POLICY IF EXISTS "Allow read access" ON public.products_inventory;
REVOKE SELECT ON public.products_inventory FROM anon, authenticated;
GRANT ALL ON public.products_inventory TO service_role;

CREATE OR REPLACE FUNCTION public.get_product_availability()
RETURNS TABLE(product_id text, size text, color text, available integer)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT product_id, size, color, LEAST(GREATEST(quantity - reserved, 0), 10)::int
  FROM public.products_inventory;
$$;
REVOKE ALL ON FUNCTION public.get_product_availability() FROM public;
GRANT EXECUTE ON FUNCTION public.get_product_availability() TO anon, authenticated;