import { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductImageSpinProps {
  images: string[];
}

const ProductImageSpin = ({ images }: ProductImageSpinProps) => {
  const frames = images.length >= 3
    ? [
        { src: images[0], mirror: false },
        { src: images[1], mirror: false },
        { src: images[2], mirror: false },
        { src: images[1], mirror: true },
      ]
    : [
        { src: images[0], mirror: false },
        { src: images[0], mirror: true },
        { src: images[1] || images[0], mirror: false },
        { src: images[1] || images[0], mirror: true },
      ];

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(0.75); // start slightly pulled back
  const startX = useRef(0);
  const frameAtStart = useRef(0);
  const autoRotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const THRESHOLD = 120;
  const MIN_ZOOM = 0.6;
  const MAX_ZOOM = 1.8;
  const ZOOM_STEP = 0.15;

  const startAutoRotate = useCallback(() => {
    if (autoRotateTimer.current) clearInterval(autoRotateTimer.current);
    autoRotateTimer.current = setInterval(() => {
      setCurrentFrame(prev => (prev + 1) % frames.length);
    }, 2500);
  }, [frames.length]);

  const stopAutoRotate = useCallback(() => {
    if (autoRotateTimer.current) {
      clearInterval(autoRotateTimer.current);
      autoRotateTimer.current = null;
    }
    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
      resumeTimer.current = null;
    }
  }, []);

  useEffect(() => {
    startAutoRotate();
    return () => { stopAutoRotate(); };
  }, [startAutoRotate, stopAutoRotate]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    frameAtStart.current = currentFrame;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    stopAutoRotate();
  }, [currentFrame, stopAutoRotate]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    const frameShift = Math.round(delta / THRESHOLD);
    const newFrame = ((frameAtStart.current + frameShift) % frames.length + frames.length) % frames.length;
    setCurrentFrame(newFrame);
  }, [isDragging, frames.length]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    resumeTimer.current = setTimeout(() => { startAutoRotate(); }, 3000);
  }, [startAutoRotate]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(prev => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prev - e.deltaY * 0.002)));
  }, []);

  const frame = frames[currentFrame];

  return (
    <div
      className={cn(
        "relative w-full aspect-square rounded-lg overflow-hidden bg-muted select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      <img
        src={frame.src}
        alt="Product view"
        className="w-full h-full object-contain transition-transform duration-200"
        style={{
          transform: `scale(${zoom})${frame.mirror ? ' scaleX(-1)' : ''}`,
        }}
        draggable={false}
      />

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 flex flex-col gap-1.5 pointer-events-auto z-10">
        <button
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.min(MAX_ZOOM, prev + ZOOM_STEP)); }}
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={(e) => { e.stopPropagation(); setZoom(prev => Math.max(MIN_ZOOM, prev - ZOOM_STEP)); }}
        >
          <ZoomOut className="h-4 w-4" />
        </button>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {frames.map((_, i) => (
          <button
            key={i}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              i === currentFrame ? "bg-foreground scale-125" : "bg-foreground/30"
            )}
            onClick={(e) => { e.stopPropagation(); setCurrentFrame(i); }}
          />
        ))}
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-3 py-1.5 rounded-full pointer-events-none">
        Перетащите для вращения
      </div>
    </div>
  );
};

export default ProductImageSpin;
