import { createElement, useEffect, useRef, type ElementType, type ReactNode } from "react";
import { REVEAL_THRESHOLD } from "@/constants";

interface FadeUpProps {
  children: ReactNode;
  delay?: 1 | 2 | 3 | 4;
  className?: string;
  as?: ElementType;
  id?: string;
}

const FadeUp = ({ children, delay, className, as = "div", id }: Readonly<FadeUpProps>) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: REVEAL_THRESHOLD },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const classes = ["fade-up", delay ? `d${delay}` : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return createElement(as, { ref, className: classes, id }, children);
};

export default FadeUp;
