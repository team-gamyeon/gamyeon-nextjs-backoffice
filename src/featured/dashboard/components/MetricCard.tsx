"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ReactNode;
  index?: number;
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  index = 0,
}: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Card className="border-border/60 transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
                isPositive
                  ? "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400"
                  : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {isPositive ? "+" : ""}
              {change}%
            </span>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{changeLabel}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
