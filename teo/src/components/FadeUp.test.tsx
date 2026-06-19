import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import FadeUp from "./FadeUp";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

const observed: Array<{ callback: ObserverCallback; el: Element }> = [];

class TriggerableIntersectionObserver {
  constructor(private readonly callback: ObserverCallback) {}

  observe(el: Element) {
    observed.push({ callback: this.callback, el });
  }

  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

const triggerIntersection = () => {
  observed.forEach(({ callback, el }) => callback([{ isIntersecting: true, target: el }]));
};

describe("FadeUp", () => {
  const original = globalThis.IntersectionObserver;

  beforeEach(() => {
    globalThis.IntersectionObserver = TriggerableIntersectionObserver as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    observed.length = 0;
    globalThis.IntersectionObserver = original;
  });

  it("keeps the visible class after a re-render changes className", () => {
    const { container, rerender } = render(<FadeUp className="faq-item">content</FadeUp>);
    const el = container.firstElementChild as HTMLElement;

    act(() => triggerIntersection());
    expect(el.classList.contains("visible")).toBe(true);

    // Parent re-renders with an updated className (e.g. accordion opening).
    rerender(<FadeUp className="faq-item open">content</FadeUp>);
    expect(el.classList.contains("visible")).toBe(true);
    expect(el.classList.contains("open")).toBe(true);
  });
});
