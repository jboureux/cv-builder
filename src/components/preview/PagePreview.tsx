import { useRef, useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const PAGE_WIDTH = 794; // 210mm at 96dpi
const PAGE_HEIGHT = 1123; // 297mm at 96dpi

interface Props {
  children: ReactNode;
  showPageBreaks?: boolean;
  className?: string;
}

/** Affiche un document A4 mis à l'échelle de la zone disponible, avec repères de saut de page. */
export function PagePreview({ children, showPageBreaks = true, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const { paddingLeft, paddingRight } = getComputedStyle(containerRef.current);
        const containerWidth = containerRef.current.clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);
        setScale(Math.min(1, containerWidth / PAGE_WIDTH));
      }
      if (pageRef.current) setHeight(Math.max(PAGE_HEIGHT, pageRef.current.offsetHeight));
    };
    update();
    const observer = new ResizeObserver(update);
    if (containerRef.current) observer.observe(containerRef.current);
    if (pageRef.current) observer.observe(pageRef.current);
    return () => observer.disconnect();
  }, []);

  const pageBreaks = Math.ceil(height / PAGE_HEIGHT) - 1;
  const pageCount = pageBreaks + 1;

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative min-w-0 flex-1 overflow-y-auto bg-muted/60 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[16px_16px] p-4 sm:p-8 dark:bg-muted/30',
        className
      )}
    >
      <div style={{ width: `${PAGE_WIDTH * scale}px` }} className="mx-auto">
        <div
          ref={pageRef}
          className="cv-print-wrapper relative overflow-hidden rounded-xs shadow-[0_1px_3px_rgb(0_0_0/0.08),0_12px_40px_-8px_rgb(0_0_0/0.18)] ring-1 ring-black/5"
          style={{
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            width: `${PAGE_WIDTH}px`,
            marginBottom: `${height * scale - height}px`,
          }}
        >
          {children}
          {showPageBreaks &&
            Array.from({ length: pageBreaks }, (_, i) => (
              <div
                key={i}
                className="no-print pointer-events-none absolute right-0 left-0 border-t-2 border-dashed border-rose-300"
                style={{ top: `${(i + 1) * PAGE_HEIGHT}px` }}
              >
                <span className="absolute -top-7 right-3 rounded-md bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-500 ring-1 ring-rose-200">
                  Page {i + 2}
                </span>
              </div>
            ))}
        </div>
      </div>
      <p className="no-print mt-4 text-center text-xs text-muted-foreground tabular-nums">
        A4 · {pageCount} page{pageCount > 1 ? 's' : ''} · {Math.round(scale * 100)} %
      </p>
    </div>
  );
}
