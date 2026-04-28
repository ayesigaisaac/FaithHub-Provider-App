import { navigateWithRouter } from "@/navigation/routerNavigate";

export type LiveFlowStepId =
  | "dashboard"
  | "builder"
  | "schedule"
  | "studio"
  | "stream"
  | "publish";
export type LiveFlowStatusBadge = "Draft" | "Ready" | "Scheduled" | "Live" | "Ended";

type StepDef = {
  id: LiveFlowStepId;
  label: string;
  route: string;
};

const STEPS: StepDef[] = [
  { id: "dashboard", label: "Dashboard", route: "/faithhub/provider/live-dashboard" },
  { id: "builder", label: "Live Builder", route: "/faithhub/provider/live-builder" },
  { id: "schedule", label: "Live Schedule", route: "/faithhub/provider/live-schedule" },
  { id: "studio", label: "Live Studio", route: "/faithhub/provider/live-studio" },
  { id: "stream", label: "Stream", route: "/faithhub/provider/stream-to-platforms" },
  { id: "publish", label: "Publish", route: "/faithhub/provider/post-live-publishing" },
];

function cx(...tokens: Array<string | false | null | undefined>) {
  return tokens.filter(Boolean).join(" ");
}

function withSession(route: string, sessionId?: string) {
  if (!sessionId) return route;
  return `${route}?sessionId=${encodeURIComponent(sessionId)}`;
}

export function LiveFlowProgressRibbon({
  currentStep,
  sessionId,
  status,
  className,
}: {
  currentStep: LiveFlowStepId;
  sessionId?: string;
  status?: LiveFlowStatusBadge;
  className?: string;
}) {
  const currentIndex = STEPS.findIndex((step) => step.id === currentStep);

  return (
    <div
      className={cx(
        "rounded-2xl border border-faith-line bg-[var(--fh-surface-bg)] px-3 py-2 dark:border-slate-800 dark:bg-slate-900",
        className,
      )}
    >
      <div className="flex items-center gap-2 overflow-x-auto">
        {STEPS.map((step, index) => {
          const isDone = index < currentIndex;
          const isCurrent = index === currentIndex;
          const stateLabel = isCurrent ? "Active" : isDone ? "Done" : "Next";
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => navigateWithRouter(withSession(step.route, sessionId))}
              className={cx(
                "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors",
                isCurrent
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : isDone
                    ? "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
                    : "border-faith-line bg-[var(--fh-surface)] text-faith-slate dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
              )}
            >
              <span>{step.label}</span>
              <span className="rounded-full bg-black/5 px-2 py-0.5 text-[10px] dark:bg-white/10">
                {stateLabel}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-2 flex items-center gap-2 overflow-x-auto">
        {(["Draft", "Ready", "Scheduled", "Live", "Ended"] as LiveFlowStatusBadge[]).map((item) => {
          const active = status === item;
          return (
            <span
              key={item}
              className={cx(
                "inline-flex shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                active
                  ? "border-orange-300 bg-orange-50 text-orange-800 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300"
                  : "border-faith-line bg-[var(--fh-surface)] text-faith-slate dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300",
              )}
            >
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
