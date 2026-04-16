

## Problem

All product images are forced into `aspect-[3/4]` with `object-cover`, which crops them to fill the box. This works for some products but ruins others:
- **Tops/bras** -- cropped to show only the center, losing the neckline and bottom
- **Bags** -- zoomed into fabric detail, losing the full silhouette
- **Leggings** -- cut at top/bottom

## Solution

Switch from `object-cover` to `object-contain` so every product is shown in full within the frame, with the muted background filling empty space. This is the standard approach for premium fashion e-commerce (Lululemon, Nike, COS).

## Changes

**`src/components/ProductCard.tsx`**:

1. Change `object-cover` to `object-contain` on the `<img>` tag -- this ensures the full product is always visible regardless of image proportions
2. Add subtle padding (`p-2` or `p-4`) to the image container so products don't touch the edges
3. Keep the `aspect-[3/4]` ratio for consistent grid alignment
4. Keep the hover scale effect

That's it -- one small but critical CSS change. The grid stays clean and aligned, but every product is fully visible.

