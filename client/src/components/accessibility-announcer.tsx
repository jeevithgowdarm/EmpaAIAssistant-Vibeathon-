import { useEffect, useRef } from "react";

export function AccessibilityAnnouncer({ message }: { message: string }) {
  const announcerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (message && announcerRef.current) {
      announcerRef.current.textContent = message;
    }
  }, [message]);

  return (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      data-testid="accessibility-announcer"
    />
  );
}
