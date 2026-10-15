"use client";

import { useEffect, useRef, useState, type FocusEvent, type PointerEvent } from "react";

// Open state for a small popup (TipChip, Term). Spread `props` on the wrapper that holds both the trigger and the
// popup. Opens on mouse hover and on keyboard focus; Escape or a pointer press elsewhere closes it. The popup sits
// inside the wrapper, so the pointer can move onto it without closing it (WCAG 1.4.13). Touch opening is up to
// the trigger's click handler, since touch browsers differ in whether a tap focuses it.
export function usePopover() {
  const ref = useRef<HTMLSpanElement>(null);
  const [open, setOpen] = useState(false);
  // Set when Escape moves focus back to the trigger, so that focus does not reopen the popup straight away.
  const dismissed = useRef(false);

  useEffect(() => {
    if (!open) return;
    const stop = new AbortController();
    const opts = { signal: stop.signal };
    document.addEventListener(
      "keydown",
      (e) => {
        if (e.key !== "Escape") return;
        setOpen(false);
        const trigger = ref.current?.querySelector<HTMLElement>("a, button");
        // Focus inside the popup would end up on a hidden element; hand it back to the trigger.
        if (trigger && ref.current?.contains(document.activeElement) && document.activeElement !== trigger) {
          dismissed.current = true;
          trigger.focus();
        }
      },
      opts,
    );
    document.addEventListener("pointerdown", (e) => !ref.current?.contains(e.target as Node) && setOpen(false), opts);
    return () => stop.abort();
  }, [open]);

  const props = {
    ref,
    onPointerEnter: (e: PointerEvent) => e.pointerType === "mouse" && setOpen(true),
    onPointerLeave: (e: PointerEvent) => e.pointerType === "mouse" && setOpen(false),
    onFocus: () => {
      if (dismissed.current) dismissed.current = false;
      else setOpen(true);
    },
    // Focus moving from the trigger into the popup's own link keeps it open.
    onBlur: (e: FocusEvent) => !ref.current?.contains(e.relatedTarget as Node) && setOpen(false),
  };
  return { open, setOpen, props };
}
