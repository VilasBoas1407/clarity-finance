import { cn } from "@/lib/utils";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function KPICard({
  title,
  value,
  change,
  icon,
  trend = "neutral",
  className,
}: KPICardProps) {
  const trendColor = {
    up: "text-destructive",
    down: "text-success",
    neutral: "text-muted-foreground",
  };

  const TrendIcon = {
    up: TrendingUp,
    down: TrendingDown,
    neutral: Minus,
  }[trend];

  return (
    <div
      className={cn(
        "relative p-5 rounded-xl bg-card border border-border shadow-card hover:shadow-card-hover transition-shadow duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-soft text-primary">
            {icon}
          </div>
        )}
      </div>
      {change && (
        <div className="flex items-center gap-1.5 mt-3">
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-medium",
              trendColor[trend]
            )}
          >
            <TrendIcon className="w-4 h-4" />
            <span>{Math.abs(change.value)}%</span>
          </div>
          <span className="text-sm text-muted-foreground">{change.label}</span>
        </div>
      )}
    </div>
  );
}
