"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface EvidenceItem {
  id: string
  source: string
  snippet: string
  timestamp: string
  credibility: "high" | "medium" | "low"
  url?: string
  highlights?: string[]
}

interface EvidenceTimelineProps {
  evidence: EvidenceItem[]
  onEvidenceClick?: (id: string) => void
}

const credibilityConfig = {
  high: {
    icon: ShieldCheck,
    color: "text-success",
    bg: "bg-success/10",
    border: "border-success/30",
    label: "High Credibility",
  },
  medium: {
    icon: ShieldQuestion,
    color: "text-warning",
    bg: "bg-warning/10",
    border: "border-warning/30",
    label: "Medium Credibility",
  },
  low: {
    icon: ShieldAlert,
    color: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
    label: "Low Credibility",
  },
}

export function EvidenceTimeline({ evidence, onEvidenceClick }: EvidenceTimelineProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set([evidence[0]?.id]))
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedItems(newExpanded)
  }

  const copySnippet = (snippet: string, id: string) => {
    navigator.clipboard.writeText(snippet)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-3">
      {evidence.map((item, index) => {
        const config = credibilityConfig[item.credibility]
        const Icon = config.icon
        const isExpanded = expandedItems.has(item.id)

        return (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border transition-all duration-200",
              config.border,
              config.bg,
              isExpanded && "ring-1 ring-primary/20",
            )}
          >
            {/* Header */}
            <button onClick={() => toggleExpand(item.id)} className="flex w-full items-center gap-3 p-4 text-left">
              <div className="flex items-center gap-2">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <div className={cn("rounded-full p-1.5", config.bg)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{item.source}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full", config.bg, config.color)}>
                    {config.label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.timestamp)}</p>
              </div>

              {/* Timeline connector */}
              {index < evidence.length - 1 && <div className="absolute left-[2.35rem] top-full h-3 w-0.5 bg-border" />}
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="border-t border-border/50 px-4 pb-4 pt-3 animate-slide-in">
                <div className="rounded-lg bg-background/50 p-3">
                  <p className="text-sm leading-relaxed text-foreground">{item.snippet}</p>
                  {item.highlights && item.highlights.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.highlights.map((highlight, i) => (
                        <span key={i} className="rounded bg-primary/20 px-1.5 py-0.5 text-xs text-primary">
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => copySnippet(item.snippet, item.id)}
                    className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-success" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1.5 text-xs text-secondary-foreground hover:bg-secondary/80 transition-colors"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      View Source
                    </a>
                  )}
                  <button
                    onClick={() => onEvidenceClick?.(item.id)}
                    className="flex items-center gap-1.5 rounded-md bg-primary/20 px-2.5 py-1.5 text-xs text-primary hover:bg-primary/30 transition-colors"
                  >
                    Link to Blockchain
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
