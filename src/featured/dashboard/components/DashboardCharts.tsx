"use client";

import dynamic from "next/dynamic";
import type { DashboardSummary } from "@/featured/dashboard/types";

function ChartSkeleton({ height }: { height: number }) {
  return (
    <div className="border-border/60 bg-card w-full rounded-xl border">
      <div className="p-6 pb-2">
        <div className="bg-muted h-4 w-28 animate-pulse rounded" />
      </div>
      <div className="p-6 pt-2">
        <div
          className="bg-muted animate-pulse rounded"
          style={{ height }}
        />
      </div>
    </div>
  );
}

const DauChart = dynamic(
  () => import("./DauChart").then((m) => ({ default: m.DauChart })),
  { ssr: false, loading: () => <ChartSkeleton height={220} /> }
);
const CompletionRateCard = dynamic(
  () => import("./CompletionRateCard").then((m) => ({ default: m.CompletionRateCard })),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> }
);
const ReportAnalysisCard = dynamic(
  () => import("./ReportAnalysisCard").then((m) => ({ default: m.ReportAnalysisCard })),
  { ssr: false, loading: () => <ChartSkeleton height={240} /> }
);

interface Props {
  signupTrend?: DashboardSummary["signupTrend"];
  interviewCompletion?: DashboardSummary["interviewCompletion"];
  reportAnalysis?: DashboardSummary["reportAnalysis"];
}

export function DashboardCharts({ signupTrend, interviewCompletion, reportAnalysis }: Props) {
  return (
    <div className="grid grid-cols-5 gap-4 items-stretch">
      <div className="col-span-3 flex">
        <DauChart signupTrend={signupTrend} />
      </div>
      <CompletionRateCard interviewCompletion={interviewCompletion} />
      <ReportAnalysisCard reportAnalysis={reportAnalysis} />
    </div>
  );
}
