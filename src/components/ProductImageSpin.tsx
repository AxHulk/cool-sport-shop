import { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageSpinProps {
  images: string[];
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.4;

const ProductImageSpin = ({ images }: ProductImageSpinProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Pointer tracking (supports multi-touch)
  const pointers = useRef<Map<number, { x: number; y: number }>>(new Map());
  const gestureStart = useRef<{
    dist: number;
    zoom: number;
    pan: { x: number; y: number };
    mid: { x: number; y: number };
  } | null>(null);
  const panStart = useRef<{ x: number; y: number; pan: { x: number; y: number } } | null>(null);
  const swipeStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const swipeLocked = useRef<'h' | 'v' | null>(null);

  const clampPan = useCallback((p: { x: number; y: number }, z: number) => {
    const el = containerRef.current;
    if (!el) return p;
    const w = el.clientWidth;
    const h = el.clientHeight;
    const maxX = (w * (z - 1)) / 2;
    const maxY = (h * (z - 1)) / 2;
    return {
      x: Math.max(-maxX, Math.min(maxX, p.x)),
      y: Math.max(-maxY, Math.min(maxY, p.y)),
    };
  }, []);

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  const selectFrame = useCallback((i: number) => {
    setCurrentFrame(i);
    setZoom(1);
    resetView();
  }, [resetView]);

  const goNext = useCallback(() => {
    if (images.length > 1) selectFrame((currentFrame + 1) % images.length);
  }, [currentFrame, images.length, selectFrame]);
  const goPrev = useCallback(() => {
    if (images.length > 1) selectFrame((currentFrame - 1 + images.length) % images.length);
  }, [currentFrame, images.length, selectFrame]);

  const zoomIn = useCallback(() => {
    setZoom(z => Math.min(MAX_ZOOM, z + ZOOM_STEP));
  }, []);
  const zoomOut = useCallback(() => {
    setZoom(z => {
      const next = Math.max(MIN_ZOOM, z - ZOOM_STEP);
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  // Pointer handlers (unified for mouse + touch + pen)
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2) {
      // Start pinch
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      gestureStart.current = {
        dist,
        zoom,
        pan,
        mid: { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 },
      };
      swipeStart.current = null;
      swipeLocked.current = null;
      panStart.current = null;
    } else if (pointers.current.size === 1) {
      if (zoom > 1) {
        panStart.current = { x: e.clientX, y: e.clientY, pan };
      } else {
        swipeStart.current = { x: e.clientX, y: e.clientY, t: Date.now() };
        swipeLocked.current = null;
      }
    }
  }, [zoom, pan]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && gestureStart.current) {
      e.preventDefault();
      const pts = Array.from(pointers.current.values());
      const dx = pts[0].x - pts[1].x;
      const dy = pts[0].y - pts[1].y;
      const dist = Math.hypot(dx, dy);
      const scale = dist / gestureStart.current.dist;
      const nextZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, gestureStart.current.zoom * scale));
      setZoom(nextZoom);
      // Keep midpoint stable-ish: adjust pan proportionally
      const adjusted = clampPan(
        {
          x: gestureStart.current.pan.x * (nextZoom / gestureStart.current.zoom),
          y: gestureStart.current.pan.y * (nextZoom / gestureStart.current.zoom),
        },
        nextZoom
      );
      setPan(adjusted);
      return;
    }

    if (pointers.current.size === 1 && panStart.current && zoom > 1) {
      e.preventDefault();
      const nx = panStart.current.pan.x + (e.clientX - panStart.current.x);
      const ny = panStart.current.pan.y + (e.clientY - panStart.current.y);
      setPan(clampPan({ x: nx, y: ny }, zoom));
      return;
    }

    // Swipe detection at zoom 1 — only lock horizontal if mostly horizontal
    if (pointers.current.size === 1 && swipeStart.current && zoom === 1) {
      const dx = e.clientX - swipeStart.current.x;
      const dy = e.clientY - swipeStart.current.y;
      if (swipeLocked.current === null) {
        if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
          swipeLocked.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
        }
      }
      // If vertical, do nothing — let page scroll naturally
    }
  }, [zoom, clampPan]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    const pt = pointers.current.get(e.pointerId);
    pointers.current.delete(e.pointerId);

    if (pointers.current.size < 2) {
      gestureStart.current = null;
    }
    if (pointers.current.size === 0) {
      // Finish swipe?
      if (swipeStart.current && pt && zoom === 1 && swipeLocked.current === 'h') {
        const dx = pt.x - swipeStart.current.x;
        const dt = Date.now() - swipeStart.current.t;
        const fast = dt < 350 && Math.abs(dx) > 30;
        if (Math.abs(dx) > 60 || fast) {
          if (dx < 0) goNext();
          else goPrev();
        }
      }
      swipeStart.current = null;
      swipeLocked.current = null;
      panStart.current = null;

      // Snap pan back into bounds in case
      setPan(p => clampPan(p, zoom));
    }
  }, [zoom, goNext, goPrev, clampPan]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (!e.ctrlKey && Math.abs(e.deltaY) < 30) return;
    e.preventDefault();
    setZoom(prev => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.005));
      if (next <= 1) setPan({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    } else {
      setZoom(2);
    }
  }, [zoom]);

  // Re-clamp pan whenever zoom changes externally
  useEffect(() => {
    setPan(p => clampPan(p, zoom));
  }, [zoom, clampPan]);

  const isZoomed = zoom > 1;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative w-full aspect-[2/3] overflow-hidden select-none',
        isZoomed ? 'touch-none cursor-grab' : 'touch-pan-y cursor-default'
      )}
      style={{ touchAction: isZoomed ? 'none' : 'pan-y' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={images[currentFrame]}
        alt="Product view"
        className="relative z-10 w-full h-full object-cover will-change-transform"
        style={{
          transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
          transition: pointers.current.size === 0 ? 'transform 0.18s ease-out' : 'none',
        }}
        draggable={false}
      />

      {/* Arrow controls — desktop only */}
      {images.length > 1 && (
        <>
          <button
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/90 transition-colors z-20"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            aria-label="Предыдущее фото"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/90 transition-colors z-20"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            aria-label="Следующее фото"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Zoom controls — desktop only */}
      <div className="hidden md:flex absolute top-3 right-3 flex-col gap-1.5 z-20">
        <button
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
          aria-label="Приблизить"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
          aria-label="Отдалить"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Tick indicators */}
      {images.length > 1 && (
        <div className="absolute top-2 left-2 right-2 z-20 flex gap-1 px-1">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); selectFrame(i); }}
              className={cn(
                'flex-1 transition-all duration-200',
                i === currentFrame ? 'h-0.5 bg-foreground' : 'h-px bg-foreground/25'
              )}
              aria-label={`Фото ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* Counter on mobile */}
      {images.length > 1 && (
        <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-20 px-2.5 py-1 rounded-full bg-background/70 backdrop-blur-sm text-[10px] font-semibold tracking-[0.15em] text-foreground/80">
          {currentFrame + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default ProductImageSpin;
