
"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({
  children,
  delay = 0,
  className = "",
  direction = "up",
}) {
  const reduceMotion = useReducedMotion();

  const offsets = {
    up: { x: 0, y: 28 },
    down: { x: 0, y: -28 },
    left: { x: 35, y: 0 },
    right: { x: -35, y: 0 },
  };

  return (
    <motion.div
      className={className}
      initial={
        reduceMotion
          ? false
          : { opacity: 0, ...offsets[direction] }
      }
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: reduceMotion ? 0 : 0.7,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
