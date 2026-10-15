"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";

/**
 * Open/closed state for a small popup (TipChip, Term). Spread `props` on a wrapper that holds both the trigger and
 * the popup.
 *
 * - Opens on mouse hover and on keyboard focus.
 * - Closes on Escape, on a pointer press outside, and when the mouse or focus leaves the wrapper.
 * - The popup sits inside the wrapper, so the mouse can move onto it without closing it (WCAG 1.4.13).
 * - Opening on touch is left to the trigger's click handler: touch browsers differ in whether a tap focuses it.
 */
export function usePopover() {
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  // Set when Escape hands focus back to the trigger, so that this focus does not reopen the popup straight away.
  const refocusAfterEscape = useRef(false);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      // Focus inside the popup would be left on a hidden element: move it back to the trigger.
      const wrapper = wrapperRef.current;
      const trigger = wrapper?.querySelector<HTMLElement>("a, button");
      if (trigger && wrapper?.contains(document.activeElement) && document.activeElement !== trigger) {
        refocusAfterEscape.current = true;
        trigger.focus();
      }
    };
    const closeOnPressOutside = (event: globalThis.PointerEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnPressOutside);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnPressOutside);
    };
  }, [open]);

  const props = {
    ref: wrapperRef,
    onPointerEnter: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setOpen(true);
    },
    onPointerLeave: (event: PointerEvent) => {
      if (event.pointerType === "mouse") setOpen(false);
    },
    onFocus: () => {
      if (refocusAfterEscape.current) refocusAfterEscape.current = false;
      else setOpen(true);
    },
    // Focus moving from the trigger to the popup's own link keeps it open.
    onBlur: (event: FocusEvent) => {
      if (!wrapperRef.current?.contains(event.relatedTarget as Node)) setOpen(false);
    },
  };

  return { open, setOpen, props };
}
