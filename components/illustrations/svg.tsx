import type { CSSProperties, ReactNode } from "react";

/**
 * Animation timing for an element of a plate, read by illustrations.css: --d is the delay after the plate scrolls
 * into view. `extra` sets the optional --dur (duration) and --from (start offset of a slide).
 */
export function delay(ms: number, extra?: { "--dur"?: string; "--from"?: string }) {
  return { "--d": `${ms}ms`, ...extra } as CSSProperties;
}

/** A label from the messages, split into its lines: two-line labels use "\n" ("fossiele\nreferentie"). */
export function lines(label: string): string[] {
  return label.split("\n");
}

// Filled arrowheads with the tip at (x, y). Paths rather than markers, so they can pop in after their line has drawn.
export const arrowheadRight = (x: number, y: number) => `M${x - 6} ${y - 4}L${x} ${y}L${x - 6} ${y + 4}Z`;
export const arrowheadDown = (x: number, y: number) => `M${x - 4} ${y - 6}L${x} ${y}L${x + 4} ${y - 6}Z`;

/** An illustration's canvas: 256 units wide, named by a title and description in the page language. */
export function Plate({
  id,
  height,
  title,
  description,
  children,
}: {
  id: string;
  height: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox={`0 0 256 ${height}`}
      className="ill-svg"
      role="img"
      aria-labelledby={`${id}-t`}
      aria-describedby={`${id}-d`}
    >
      <title id={`${id}-t`}>{title}</title>
      <desc id={`${id}-d`}>{description}</desc>
      {children}
    </svg>
  );
}
