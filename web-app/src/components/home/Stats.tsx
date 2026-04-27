"use client";

import { motion } from "framer-motion";
import { Gift, Handshake, Star, Palette } from "lucide-react";
import { useEffect, useState } from "react";

const stats = [
  { icon: Gift, value: 250, suffix: "+", label: "Événements Organisés" },
  { icon: Handshake, value: 150, suffix: "+", label: "Clients Satisfaits" },
  { icon: Star, value: 95, suffix: "%", label: "Taux de Satisfaction" },
  { icon: Palette, value: 100, suffix: "%", label: "Créativité & Innovation" },
];

// smooth counter
function useCountUp(target: number, start: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startValue = 0;
    const step = target / (duration / 16);

    const timer = setInterval(() => {
      startValue += step;

      if (startValue >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(startValue));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [start, target]);

  return count;
}

export default function StatsSection() {
  const [start, setStart] = useState(false);

  return (
    <section className="bg-white py-24">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              onViewportEnter={() => setStart(true)}
              className="flex flex-col items-center text-center"
            >
              {/* ICON */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="text-red-500 mb-4"
              >
                <Icon size={36} />
              </motion.div>

              {/* VALUE */}
              <h3 className="text-4xl font-bold text-gray-900">
                {useCountUp(item.value, start)}
                {item.suffix}
              </h3>

              {/* LABEL */}
              <p className="text-sm text-gray-500 mt-2">
                {item.label}
              </p>

              {/* underline animation */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 40 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-[2px] bg-red-500 mt-3 rounded-full"
              />
            </motion.div>
          );
        })}

      </div>
    </section>
  );
}