import { useRef, useEffect, useState, type ReactNode } from 'react';

const PAGE_WIDTH = 794; // 210mm at 96dpi
const PAGE_HEIGHT = 1123; // 297mm at 96dpi

interface Props {
  children: ReactNode;
}

/** Affiche un document A4 mis à l'échelle de la zone disponible, avec repères de saut de page. */
export function PagePreview({ children }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(PAGE_HEIGHT);

  useEffect(() => {
    const update = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth - 32;
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

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto bg-slate-100 p-4">
      <div
        ref={pageRef}
        className="cv-print-wrapper relative"
        style={{
          transformOrigin: 'top left',
          transform: `scale(${scale})`,
          width: `${PAGE_WIDTH}px`,
          boxShadow: '0 4px 24px rgba(0,0,0,0.13)',
          borderRadius: '2px',
          marginBottom: `${height * scale - height + 16}px`,
        }}
      >
        {children}
        {Array.from({ length: pageBreaks }, (_, i) => (
          <div
            key={i}
            className="no-print absolute left-0 right-0 pointer-events-none border-t-2 border-dashed border-rose-300"
            style={{ top: `${(i + 1) * PAGE_HEIGHT}px` }}
          >
            <span className="absolute right-2 -top-6 text-xs font-medium text-rose-400 bg-white/80 px-1.5 rounded">
              Page {i + 2}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
