import { useEffect, useId, useRef, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { ChevronUp } from "lucide-react";

const OPEN_FEEDBACK = "proposal:open-feedback";
const MOBILE_QUERY = "(max-width: 767px)";

export function openMobileFeedback(event: MouseEvent<HTMLAnchorElement>) {
  if (!window.matchMedia(MOBILE_QUERY).matches) return;
  event.preventDefault();
  window.dispatchEvent(new Event(OPEN_FEEDBACK));
}

export default function ProposalCheckout({
  enabled,
  total,
  children,
}: {
  enabled: boolean;
  total: string;
  children: ReactNode;
}) {
  const [mobile, setMobile] = useState(false);
  const [open, setOpen] = useState(false);
  const [inline, setInline] = useState(false);
  const inlineRef = useRef(false);
  inlineRef.current = inline;
  const sentinel = useRef<HTMLDivElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const showFeedback = useRef(false);
  const panelId = useId();

  useEffect(() => {
    if (!enabled) return;
    const media = window.matchMedia(MOBILE_QUERY);
    const resize = () => {
      setMobile(media.matches);
      if (!media.matches) {
        setOpen(false);
        setInline(false);
      }
    };
    const openFeedback = () => {
      if (!media.matches) return;
      if (inlineRef.current) {
        panel.current
          ?.querySelector("#send-feedback")
          ?.scrollIntoView({ block: "start" });
        return;
      }
      showFeedback.current = true;
      setOpen(true);
    };
    resize();
    media.addEventListener("change", resize);
    window.addEventListener(OPEN_FEEDBACK, openFeedback);
    return () => {
      media.removeEventListener("change", resize);
      window.removeEventListener(OPEN_FEEDBACK, openFeedback);
    };
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !mobile || !sentinel.current) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (!sentinel.current) return;
      const atEnd =
        sentinel.current.getBoundingClientRect().top <= window.innerHeight - 88;
      setInline(atEnd);
      if (atEnd) setOpen(false);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    // Scroll events also catch jumps that skip across the entire viewport.
    const observer = new IntersectionObserver(schedule, {
      rootMargin: "0px 0px -88px 0px",
    });
    observer.observe(sentinel.current);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.cancelAnimationFrame(frame);
    };
  }, [enabled, mobile]);

  useEffect(() => {
    if (!enabled || !mobile || !open || inline || !sheet.current) return;
    const element = sheet.current;
    const trigger = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Keep keyboard navigation in the sheet without duplicating the form.
    const siblings = new Map<HTMLElement, boolean>();
    let branch: HTMLElement = element;
    while (branch.parentElement && branch !== document.body) {
      for (const sibling of branch.parentElement.children) {
        if (
          sibling instanceof HTMLElement &&
          sibling !== branch &&
          !sibling.hasAttribute("data-checkout-backdrop")
        ) {
          siblings.set(sibling, sibling.inert);
          sibling.inert = true;
        }
      }
      branch = branch.parentElement;
    }
    const viewport = window.visualViewport;
    const fit = () => {
      const height = viewport?.height ?? window.innerHeight;
      const bottom = Math.max(
        0,
        window.innerHeight - height - (viewport?.offsetTop ?? 0),
      );
      element.style.setProperty("--proposal-viewport-height", `${height}px`);
      element.style.setProperty("--proposal-keyboard-offset", `${bottom}px`);
    };
    fit();
    viewport?.addEventListener("resize", fit);
    viewport?.addEventListener("scroll", fit);
    toggle.current?.focus({ preventScroll: true });
    if (panel.current) {
      const feedback =
        panel.current.querySelector<HTMLElement>("#send-feedback");
      panel.current.scrollTop =
        showFeedback.current && feedback
          ? feedback.getBoundingClientRect().top -
            panel.current.getBoundingClientRect().top +
            panel.current.scrollTop
          : 0;
    }
    showFeedback.current = false;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        element.querySelectorAll<HTMLElement>(
          'button, a[href], input, textarea, select, summary, [tabindex="0"]',
        ),
      ).filter(
        (item) =>
          item.getClientRects().length &&
          !item.matches(":disabled") &&
          !item.closest("[inert]"),
      );
      const first = focusable[0],
        last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    element.addEventListener("keydown", keydown);
    return () => {
      element.removeEventListener("keydown", keydown);
      viewport?.removeEventListener("resize", fit);
      viewport?.removeEventListener("scroll", fit);
      element.style.removeProperty("--proposal-viewport-height");
      element.style.removeProperty("--proposal-keyboard-offset");
      document.body.style.overflow = overflow;
      siblings.forEach((inert, sibling) => {
        sibling.inert = inert;
      });
      if (
        trigger instanceof HTMLElement &&
        trigger.isConnected &&
        trigger.getClientRects().length
      )
        trigger.focus({ preventScroll: true });
    };
  }, [enabled, mobile, open, inline]);

  return (
    <>
      {enabled && (
        <div
          ref={sentinel}
          className="proposal-checkout-sentinel"
          aria-hidden="true"
        />
      )}
      {enabled && mobile && open && !inline && (
        <div
          className="proposal-checkout-backdrop"
          data-checkout-backdrop
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
      <div
        ref={sheet}
        className={`proposal-checkout ${enabled ? "proposal-checkout--client" : ""}`}
        data-open={open || inline}
        data-inline={inline}
        role={enabled && mobile && open && !inline ? "dialog" : undefined}
        aria-modal={enabled && mobile && open && !inline ? true : undefined}
        aria-label={
          enabled && mobile && open && !inline ? "One-time total" : undefined
        }
      >
        {enabled && inline ? (
          <div className="proposal-checkout-toggle">
            <span>One-time total</span>
            <strong>{total}</strong>
          </div>
        ) : (
          enabled && (
            <button
              ref={toggle}
              type="button"
              className="proposal-checkout-toggle"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => {
                showFeedback.current = false;
                setOpen((value) => !value);
              }}
            >
              <span>One-time total</span>
              <strong>{total}</strong>
              <ChevronUp className="h-5 w-5" aria-hidden="true" />
            </button>
          )
        )}
        <div ref={panel} id={panelId} className="proposal-checkout-panel">
          {children}
        </div>
      </div>
    </>
  );
}
