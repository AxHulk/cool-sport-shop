import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageSpinProps {
  images: string[];
}

const ProductImageSpin = ({ images }: ProductImageSpinProps) => {
  // Build 4 frames from available images
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
  const startX = useRef(0);
  const frameAtStart = useRef(0);
  const autoRotateTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const THRESHOLD = 120;

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
    return () => {
      stopAutoRotate();
    };
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
    resumeTimer.current = setTimeout(() => {
      startAutoRotate();
    }, 3000);
  }, [startAutoRotate]);

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
    >
      <img
        src={frame.src}
        alt="Product view"
        className="w-full h-full object-cover transition-transform duration-100"
        style={frame.mirror ? { transform: 'scaleX(-1)' } : undefined}
        draggable={false}
      />
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
