import type { CSSProperties } from "react";

/**
 * The stagger index (--i) of the motion contract in app/globals.css: an element with data-reveal (or .hero-in)
 * starts `index` × --m-stagger after the first one.
 */
export function stagger(index: number) {
  return { "--i": index } as CSSProperties;
}
