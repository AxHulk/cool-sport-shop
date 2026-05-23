import { useState, useRef, useCallback } from 'react';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageSpinProps {
  images: string[];
}

const ProductImageSpin = ({ images }: ProductImageSpinProps) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0 });
  const panOffset = useRef({ x: 0, y: 0 });

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 3;
  const ZOOM_STEP = 0.3;

  const resetView = useCallback(() => {
    setPan({ x: 0, y: 0 });
    panOffset.current = { x: 0, y: 0 };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (zoom <= 1) return;
    setIsPanning(true);
    panStart.current = { x: e.clientX - panOffset.current.x, y: e.clientY - panOffset.current.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [zoom]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning) return;
    const newX = e.clientX - panStart.current.x;
    const newY = e.clientY - panStart.current.y;
    panOffset.current = { x: newX, y: newY };
    setPan({ x: newX, y: newY });
  }, [isPanning]);

  const handlePointerUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => {
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.003));
      if (next <= 1) resetView();
      return next;
    });
  }, [resetView]);

  const zoomIn = useCallback(() => {
    setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom(prev => {
      const next = Math.max(MIN_ZOOM, prev - ZOOM_STEP);
      if (next <= 1) resetView();
      return next;
    });
  }, [resetView]);

  const selectFrame = useCallback((i: number) => {
    setCurrentFrame(i);
    setZoom(1);
    resetView();
  }, [resetView]);

  // Swipe handling (only when not zoomed)
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoom > 1) return;
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swiped.current = false;
  }, [zoom]);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (zoom > 1 || !touchStart.current) return;
    const dx = e.touches[0].clientX - touchStart.current.x;
    const dy = e.touches[0].clientY - touchStart.current.y;
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      swiped.current = true;
    }
  }, [zoom]);
  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;
    if (swiped.current && images.length > 1) {
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      if (Math.abs(dx) > 30) {
        if (dx < 0) selectFrame((currentFrame + 1) % images.length);
        else selectFrame((currentFrame - 1 + images.length) % images.length);
      }
    }
    touchStart.current = null;
  }, [currentFrame, images.length, selectFrame]);

  return (
    <div
      className={cn(
        "relative w-full aspect-[2/3] overflow-hidden select-none touch-pan-y",
        zoom > 1 ? (isPanning ? "cursor-grabbing" : "cursor-grab") : "cursor-default"
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img
        src={images[currentFrame]}
        alt="Product view"
        className="relative z-10 w-full h-full object-cover transition-transform duration-200"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
        }}
        draggable={false}
      />

      {/* Arrow controls */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/90 transition-colors z-20"
            onClick={(e) => { e.stopPropagation(); selectFrame((currentFrame - 1 + images.length) % images.length); }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/70 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-background/90 transition-colors z-20"
            onClick={(e) => { e.stopPropagation(); selectFrame((currentFrame + 1) % images.length); }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-20">
        <button
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); zoomIn(); }}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); zoomOut(); }}
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
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageSpin;
