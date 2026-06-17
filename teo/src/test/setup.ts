import "@testing-library/jest-dom";

class IntersectionObserverStub {
  observe() {
    // intentionally empty: elements never intersect in jsdom
  }

  unobserve() {
    // intentionally empty
  }

  disconnect() {
    // intentionally empty
  }

  takeRecords() {
    return [];
  }
}

Object.defineProperty(globalThis, "IntersectionObserver", {
  writable: true,
  value: IntersectionObserverStub,
});
