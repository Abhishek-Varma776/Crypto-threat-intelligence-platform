import { cn } from "@/lib/utils"

interface RiskBadgeProps {
  score: number
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
}

export function RiskBadge({ score, showLabel = true, size = "md" }: RiskBadgeProps) {
  const getRiskLevel = (score: number) => {
    if (score >= 90) return { label: "Critical", color: "bg-destructive text-white", pulse: true }
    if (score >= 75) return { label: "High", color: "bg-warning text-white", pulse: false }
    if (score >= 50) return { label: "Medium", color: "bg-chart-2 text-white", pulse: false }
    if (score >= 25) return { label: "Low", color: "bg-success text-white", pulse: false }
    return { label: "Safe", color: "bg-success text-white", pulse: false }
  }

  const risk = getRiskLevel(score)

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all",
        risk.color,
        sizeStyles[size],
        risk.pulse && "animate-pulse",
      )}
    >
      <span className="font-bold">{score}</span>
      {showLabel && <span className="opacity-90">• {risk.label}</span>}
    </span>
  )
}
