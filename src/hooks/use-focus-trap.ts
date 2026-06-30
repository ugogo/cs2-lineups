"use client";

import { useEffect, type RefObject } from "react";

export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;

    const focusables = () =>
      [
        ...container.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.offsetParent !== null || el === document.activeElement);

    function focusFirst() {
      const items = focusables();
      items[0]?.focus();
    }

    focusFirst();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const items = focusables();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);

    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [active, containerRef]);
}
