"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Brain, FileSearch, Link2, User, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface RiskFactor {
  id: string
  name: string
  score: number
  weight: number
  description: string
  icon: typeof Brain
  color: string
}

interface RiskBreakdownProps {
  overallScore: number
  factors: RiskFactor[]
  onFactorClick?: (factorId: string) => void
}

export function RiskBreakdown({ overallScore, factors, onFactorClick }: RiskBreakdownProps) {
  const [expandedFactor, setExpandedFactor] = useState<string | null>(null)

  const getScoreColor = (score: number) => {
    if (score >= 75) return "bg-destructive"
    if (score >= 50) return "bg-warning"
    if (score >= 25) return "bg-chart-2"
    return "bg-success"
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 75) return "text-destructive"
    if (score >= 50) return "text-warning"
    if (score >= 25) return "text-chart-2"
    return "text-success"
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Risk Breakdown</h3>
          <p className="text-sm text-muted-foreground">ML + OSINT + Chain + PII analysis</p>
        </div>
        <div className="text-right">
          <div className={cn("text-4xl font-bold", getScoreTextColor(overallScore))}>{overallScore}</div>
          <p className="text-xs text-muted-foreground">Overall Score</p>
        </div>
      </div>

      {/* Stacked bar showing contributions */}
      <div className="mb-6">
        <div className="h-4 rounded-full bg-secondary overflow-hidden flex">
          {factors.map((factor) => (
            <div
              key={factor.id}
              className={cn("h-full transition-all duration-300", factor.color)}
              style={{ width: `${(factor.score * factor.weight) / 100}%` }}
              title={`${factor.name}: ${factor.score}%`}
            />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>0</span>
          <span>Composite Risk Score</span>
          <span>100</span>
        </div>
      </div>

      {/* Factor breakdown */}
      <div className="space-y-3">
        {factors.map((factor) => {
          const isExpanded = expandedFactor === factor.id
          const Icon = factor.icon

          return (
            <div key={factor.id} className="rounded-lg bg-secondary/50">
              <button
                onClick={() => setExpandedFactor(isExpanded ? null : factor.id)}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <div className={cn("rounded-lg p-2", factor.color.replace("bg-", "bg-").replace(/\/\d+/, "/20"))}>
                  <Icon className={cn("h-4 w-4", factor.color.replace("bg-", "text-").replace(/\/\d+/, ""))} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{factor.name}</span>
                    <span className={cn("text-sm font-bold", getScoreTextColor(factor.score))}>{factor.score}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-secondary">
                    <div
                      className={cn("h-1.5 rounded-full transition-all duration-500", getScoreColor(factor.score))}
                      style={{ width: `${factor.score}%` }}
                    />
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border/50 px-3 pb-3 pt-2 animate-slide-in">
                  <div className="flex items-start gap-2 rounded-lg bg-background/50 p-3">
                    <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-foreground">{factor.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Weight: {(factor.weight * 100).toFixed(0)}% of total score
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onFactorClick?.(factor.id)}
                    className="mt-2 text-xs text-primary hover:underline"
                  >
                    View supporting evidence →
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Default risk factors
export const defaultRiskFactors: RiskFactor[] = [
  {
    id: "ml",
    name: "ML Classifier",
    score: 92,
    weight: 0.3,
    description:
      "Neural network analysis of transaction patterns, timing, and wallet behavior indicates high probability of malicious activity.",
    icon: Brain,
    color: "bg-primary",
  },
  {
    id: "osint",
    name: "OSINT Severity",
    score: 85,
    weight: 0.25,
    description:
      "Multiple reports from verified sources including BitcoinAbuse, ScamAlert, and community forums with consistent fraud allegations.",
    icon: FileSearch,
    color: "bg-destructive",
  },
  {
    id: "chain",
    name: "Blockchain Patterns",
    score: 78,
    weight: 0.25,
    description:
      "Detected mixer usage, rapid fund movement, and cross-chain bridging patterns consistent with money laundering behavior.",
    icon: Link2,
    color: "bg-warning",
  },
  {
    id: "pii",
    name: "PII Association",
    score: 100,
    weight: 0.2,
    description:
      "Extracted personally identifiable information linked to known fraudulent accounts and scam operations.",
    icon: User,
    color: "bg-chart-2",
  },
]
