import { useState } from "react";

export function useDonutChart<T extends { name: string }>(data: T[]) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex !== null ? data[activeIndex] : null;
  return { activeIndex, setActiveIndex, active };
}
