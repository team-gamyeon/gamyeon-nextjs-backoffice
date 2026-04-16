import { useMemo, useState } from "react";
import type { DashboardSummary } from "@/featured/dashboard/types";
import { DAY_LABELS } from "@/featured/dashboard/constants";

function getMondayOfWeek(weekOffset: number): Date {
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1) + weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function getWeekOffsetForDate(date: Date): number {
  const mondayOfCurrent = getMondayOfWeek(0);
  const dow = date.getDay();
  const mondayOfDate = new Date(date);
  mondayOfDate.setDate(date.getDate() - (dow === 0 ? 6 : dow - 1));
  mondayOfDate.setHours(0, 0, 0, 0);
  const diffMs = mondayOfDate.getTime() - mondayOfCurrent.getTime();
  return Math.round(diffMs / (7 * 24 * 60 * 60 * 1000));
}

function buildWeekData(weekOffset: number, itemMap: Map<string, number>) {
  const monday = getMondayOfWeek(weekOffset);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return {
      date: `${mm}/${dd}`,
      day: DAY_LABELS[i],
      count: itemMap.get(`${yyyy}-${mm}-${dd}`) ?? 0,
    };
  });
}

export function getWeekLabel(weekOffset: number): string {
  const monday = getMondayOfWeek(weekOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;
  return `${fmt(monday)} ~ ${fmt(sunday)}`;
}

export function useSignupTrend(signupTrend?: DashboardSummary["signupTrend"]) {
  const { itemMap, minOffset, maxOffset } = useMemo(() => {
    if (!signupTrend?.items?.length) {
      return { itemMap: new Map<string, number>(), minOffset: 0, maxOffset: 0 };
    }
    const map = new Map<string, number>();
    signupTrend.items.forEach((item) => map.set(item.date, item.count));

    const offsets = signupTrend.items.map((item) =>
      getWeekOffsetForDate(new Date(item.date))
    );
    return {
      itemMap: map,
      minOffset: Math.min(...offsets),
      maxOffset: Math.max(...offsets),
    };
  }, [signupTrend]);

  const [weekOffset, setWeekOffset] = useState(maxOffset);

  const weekData = useMemo(
    () => buildWeekData(weekOffset, itemMap),
    [weekOffset, itemMap]
  );

  const weekLabel = getWeekLabel(weekOffset);

  return { weekOffset, setWeekOffset, weekData, weekLabel, minOffset, maxOffset };
}
