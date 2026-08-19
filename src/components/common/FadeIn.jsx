import { motion } from "framer-motion";
import { DIRECTIONS } from "@/lib/motion";

/**
 * Shared scroll-entrance animation — subtle fade + rise, used across landing
 * sections. `whileInView` uses the same IntersectionObserver mechanism a
 * hand-rolled useInView hook would, just via framer-motion's viewport prop.
 */
export default function FadeIn({ children, delay = 0, direction = "up", className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...DIRECTIONS[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Parent for a group of children that should reveal in sequence rather than
 * all at once — pass `staggerItem()` (from @/lib/motion) as the `variants`
 * prop on each direct motion.* child. Same viewport/once semantics as FadeIn.
 */
export function Stagger({ children, className, gap = 0.08 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}
