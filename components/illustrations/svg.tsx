import type { CSSProperties, ReactNode } from "react";

// Motion knobs read by illustrations.css: --d is the delay after the figure enters view; --dur and --from are optional.
export const d = (ms: number, more?: Record<string, string>) => ({ "--d": `${ms}ms`, ...more }) as CSSProperties;

// Filled arrowheads with the tip at (x, y). Paths instead of markers, so they can pop in after their line has drawn.
export const headRight = (x: number, y: number) => `M${x - 6} ${y - 4}L${x} ${y}L${x - 6} ${y + 4}Z`;
export const headDown = (x: number, y: number) => `M${x - 4} ${y - 6}L${x} ${y}L${x + 4} ${y - 6}Z`;

// Figure canvas, 256 units wide, named by a title and description in the page language.
export function Plate({ id, height, title, desc, children }: { id: string; height: number; title: string; desc: string; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 256 ${height}`}
      className="ill-svg"
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{desc}</desc>
      {children}
    </svg>
  );
}
