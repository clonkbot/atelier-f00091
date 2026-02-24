import { useRef, useEffect, useImperativeHandle, forwardRef, useCallback, useState } from 'react';

type Tool = 'brush' | 'splatter' | 'drip';

interface CanvasProps {
  color: string;
  tool: Tool;
  brushSize: number;
}

interface CanvasHandle {
  clear: () => void;
  save: () => string | null;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ color, tool, brushSize }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Resize handler
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({
          width: Math.floor(rect.width),
          height: Math.floor(rect.height),
        });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Setup canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.width * 2;
    canvas.height = canvasSize.height * 2;
    canvas.style.width = `${canvasSize.width}px`;
    canvas.style.height = `${canvasSize.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    contextRef.current = ctx;
  }, [canvasSize]);

  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const drawBrushStroke = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }, [color, brushSize]);

  const drawSplatter = useCallback((x: number, y: number) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const numDroplets = Math.floor(Math.random() * 12) + 8;

    for (let i = 0; i < numDroplets; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * brushSize * 3;
      const dropletX = x + Math.cos(angle) * distance;
      const dropletY = y + Math.sin(angle) * distance;
      const dropletSize = Math.random() * brushSize * 0.5 + 2;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(dropletX, dropletY, dropletSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [color, brushSize]);

  const drawDrip = useCallback((x: number, y: number) => {
    const ctx = contextRef.current;
    if (!ctx) return;

    const dripLength = Math.random() * 80 + 40;
    const dripWidth = Math.random() * brushSize * 0.5 + brushSize * 0.5;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, dripWidth, dripWidth, 0, 0, Math.PI * 2);
    ctx.fill();

    // Draw the drip
    ctx.beginPath();
    ctx.moveTo(x - dripWidth * 0.3, y);
    ctx.quadraticCurveTo(x - dripWidth * 0.2, y + dripLength * 0.5, x, y + dripLength);
    ctx.quadraticCurveTo(x + dripWidth * 0.2, y + dripLength * 0.5, x + dripWidth * 0.3, y);
    ctx.fill();
  }, [color, brushSize]);

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const coords = getCoordinates(e);
    lastPoint.current = coords;

    if (tool === 'splatter') {
      drawSplatter(coords.x, coords.y);
    } else if (tool === 'drip') {
      drawDrip(coords.x, coords.y);
    }
  }, [getCoordinates, tool, drawSplatter, drawDrip]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;

    const coords = getCoordinates(e);

    if (tool === 'brush' && lastPoint.current) {
      drawBrushStroke(lastPoint.current, coords);
    } else if (tool === 'splatter' && Math.random() > 0.7) {
      drawSplatter(coords.x, coords.y);
    } else if (tool === 'drip' && Math.random() > 0.9) {
      drawDrip(coords.x, coords.y);
    }

    lastPoint.current = coords;
  }, [getCoordinates, tool, drawBrushStroke, drawSplatter, drawDrip]);

  const handleEnd = useCallback(() => {
    isDrawing.current = false;
    lastPoint.current = null;
  }, []);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const ctx = contextRef.current;
      if (!ctx) return;
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
    },
    save: () => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      return canvas.toDataURL('image/png');
    },
  }), [canvasSize]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[400px] bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl"
      style={{
        boxShadow: '0 0 60px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3)',
      }}
    >
      {/* Canvas frame effect */}
      <div className="absolute inset-0 pointer-events-none border-[6px] md:border-8 border-[#2a2520] rounded-xl z-10" />
      <div className="absolute inset-2 pointer-events-none border border-[#3a3530] rounded-lg z-10" />

      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
      />

      {/* Instruction overlay */}
      <div className="absolute bottom-4 left-4 right-4 flex justify-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <p className="font-body text-xs text-white/40 text-center">
            {tool === 'brush' && 'Click and drag to paint'}
            {tool === 'splatter' && 'Click to splatter paint'}
            {tool === 'drip' && 'Click to create drips'}
          </p>
        </div>
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
