// Shared framer-motion variant helpers — kept out of FadeIn.jsx so that file
// only exports components (Vite Fast Refresh requirement).
export const DIRECTIONS = {
  up: { y: 16 },
  down: { y: -16 },
  left: { x: 16 },
  right: { x: -16 },
};

export function staggerItem(direction = "up") {
  return {
    hidden: { opacity: 0, ...DIRECTIONS[direction] },
    show: { opacity: 1, x: 0, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };
}
