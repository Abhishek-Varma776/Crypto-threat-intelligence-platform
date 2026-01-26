"use client"

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  variant?: "default" | "success" | "warning" | "danger"
  onClick?: () => void
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, variant = "default", onClick }: StatCardProps) {
  const variantStyles = {
    default: "border-border hover:border-primary/30",
    success: "border-success/50 hover:border-success",
    warning: "border-warning/50 hover:border-warning",
    danger: "border-destructive/50 hover:border-destructive",
  }

  const iconStyles = {
    default: "bg-secondary text-foreground",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    danger: "bg-destructive/20 text-destructive",
  }

  const trendColors = {
    positive: "text-success",
    negative: "text-destructive",
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-xl border bg-card p-6 transition-all duration-200 hover:shadow-lg",
        variantStyles[variant],
        onClick && "cursor-pointer",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold text-card-foreground">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && (
            <div
              className={cn(
                "mt-2 inline-flex items-center text-xs font-medium",
                trend.isPositive ? trendColors.positive : trendColors.negative,
              )}
            >
              {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last week
            </div>
          )}
        </div>
        <div className={cn("rounded-lg p-3", iconStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}
