import { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ProductImageSpinProps {
  images: string[];
}

const ProductImageSpin = ({ images }: ProductImageSpinProps) => {
  // Build 4 frames: front, angle, back, angle-mirrored
  const frames = [
    { src: images[0], mirror: false }, // front
    { src: images[1], mirror: false }, // angle left
    { src: images[2], mirror: false }, // back
    { src: images[1], mirror: true },  // angle right (mirrored)
  ];

  const [currentFrame, setCurrentFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const accumulatedDelta = useRef(0);
  const frameAtStart = useRef(0);

  const THRESHOLD = 60;

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    startX.current = e.clientX;
    accumulatedDelta.current = 0;
    frameAtStart.current = currentFrame;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [currentFrame]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - startX.current;
    const frameShift = Math.round(delta / THRESHOLD);
    const newFrame = ((frameAtStart.current + frameShift) % frames.length + frames.length) % frames.length;
    setCurrentFrame(newFrame);
  }, [isDragging, frames.length]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
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
    >
      <img
        src={frame.src}
        alt="Product view"
        className="w-full h-full object-cover transition-transform duration-100"
        style={frame.mirror ? { transform: 'scaleX(-1)' } : undefined}
        draggable={false}
      />
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
