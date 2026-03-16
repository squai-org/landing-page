import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { ANIMATION_DURATION, ANIMATION_VIEWPORT_MARGIN } from "@/constants";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedSection = ({ children, className = "", delay = 0 }: AnimatedSectionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: ANIMATION_VIEWPORT_MARGIN }}
    transition={{ duration: ANIMATION_DURATION, ease: "easeOut", delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export default AnimatedSection;
