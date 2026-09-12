import { useLayoutEffect, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { Check, Pencil, Undo2 } from "lucide-react";

import type { DoodleStroke } from "@/lib/proposal/types";

interface Props {
  targetId: string;
  title: string;
  doodles: DoodleStroke[];
  onDraw?: (stroke: DoodleStroke) => void;
  onUndo?: (targetId: string) => void;
  children: ReactNode;
}

export default function ProposalMarkup({ targetId, title, doodles, onDraw, onUndo, children }: Props) {
  const [drawing, setDrawing] = useState(false);
  const [draft, setDraft] = useState<DoodleStroke["points"]>([]);
  const pointer = useRef<number | null>(null);
  const points = useRef<DoodleStroke["points"]>([]);
  const frame = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const marks = doodles.filter((stroke) => stroke.targetId === targetId);
  const originalWidth = marks.find((stroke) => stroke.surfaceWidth)?.surfaceWidth;
  const scale = originalWidth && size.width ? Math.min(1, size.width / originalWidth) : 1;

  useLayoutEffect(() => {
    const measure = () => {
      const width = frame.current?.clientWidth ?? 0;
      const height = card.current?.offsetHeight ?? 0;
      setSize((previous) => previous.width === width && previous.height === height ? previous : { width, height });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(frame.current!);
    observer.observe(card.current!);
    measure();
    return () => observer.disconnect();
  }, []);

  function point(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const normalize = (value: number) => Math.round(Math.max(0, Math.min(1, value)) * 10000) / 10000;
    return { x: normalize((event.clientX - bounds.left) / bounds.width), y: normalize((event.clientY - bounds.top) / bounds.height) };
  }

  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    if (pointer.current !== event.pointerId) return;
    if (!cancelled && points.current.length > 1) {
      onDraw?.({ id: crypto.randomUUID(), targetId, surfaceWidth: card.current?.offsetWidth, points: points.current, createdAt: new Date().toISOString() });
    }
    pointer.current = null;
    points.current = [];
    setDraft([]);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  return (
    <div className="min-w-0" data-proposal-option={targetId}>
      <div ref={frame} style={{ height: originalWidth ? size.height * scale : undefined }}>
      <div ref={card} className={`relative ${drawing ? "rounded-2xl ring-2 ring-brand-500 ring-offset-2" : ""}`} style={{ width: originalWidth, transform: originalWidth ? `scale(${scale})` : undefined, transformOrigin: "top left" }}>
        {children}
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-danger-600" viewBox="0 0 100 100" preserveAspectRatio="none" data-proposal-ink={targetId}>
          {[...marks, ...(draft.length > 1 ? [{ id: "draft", points: draft }] : [])].map((stroke) => (
            <polyline key={stroke.id} points={stroke.points.map(({ x, y }) => `${x * 100},${y * 100}`).join(" ")} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
        {drawing && onDraw && (
          <div
            className="absolute inset-0 cursor-crosshair touch-none rounded-2xl"
            role="img"
            aria-label={`Draw on ${title}`}
            data-drawing-surface={targetId}
            onPointerDown={(event) => {
              if (pointer.current !== null || event.button !== 0) return;
              event.preventDefault();
              pointer.current = event.pointerId;
              event.currentTarget.setPointerCapture(event.pointerId);
              points.current = [point(event)];
              setDraft(points.current);
            }}
            onPointerMove={(event) => {
              if (pointer.current !== event.pointerId) return;
              const next = point(event);
              const last = points.current.at(-1)!;
              if (Math.hypot(next.x - last.x, next.y - last.y) < 0.002) return;
              const previous = points.current.length >= 100 ? points.current.filter((_, index) => index % 2 === 0) : points.current;
              points.current = [...previous, next];
              setDraft(points.current);
            }}
            onPointerUp={(event) => finish(event)}
            onPointerCancel={(event) => finish(event, true)}
            onLostPointerCapture={(event) => finish(event, true)}
          />
        )}
      </div>
      </div>
      {onDraw && (
        <div className="mt-2 flex min-h-9 items-center justify-end gap-3 text-xs font-semibold">
          {drawing && <span className="mr-auto text-brand-700">Draw on this option</span>}
          {marks.length > 0 && <button type="button" onClick={() => onUndo?.(targetId)} aria-label={`Undo last mark on ${title}`} className="inline-flex min-h-9 items-center gap-1 text-brand-700"><Undo2 className="h-3.5 w-3.5" />Undo</button>}
          <button type="button" aria-pressed={drawing} aria-label={drawing ? `Finish drawing on ${title}` : `Draw on ${title}`} onClick={() => setDrawing(!drawing)} className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2.5 ${drawing ? "bg-brand-600 text-white" : "text-brand-700 hover:bg-brand-50"}`}>
            {drawing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}{drawing ? "Done" : "Draw"}
          </button>
        </div>
      )}
    </div>
  );
}
