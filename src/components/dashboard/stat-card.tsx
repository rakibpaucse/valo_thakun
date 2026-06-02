import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "default",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "accent";
}) {
  const toneClass = {
    default: "from-primary/10 to-accent/10 text-primary",
    success: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
    warning: "from-amber-500/10 to-amber-500/5 text-amber-600",
    accent: "from-accent/15 to-accent/5 text-accent",
  }[tone];

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
        </div>
        {icon && (
          <div className={cn("grid size-10 place-items-center rounded-xl bg-gradient-to-br", toneClass)}>{icon}</div>
        )}
      </div>
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
