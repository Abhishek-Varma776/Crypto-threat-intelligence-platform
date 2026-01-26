"use client"

import type { Alert } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { AlertTriangle, Bell, Zap, Wallet, ChevronRight, Check, UserPlus } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface AlertCardProps {
  alert: Alert
}

const alertIcons = {
  "high-risk": AlertTriangle,
  "suspicious-pii": Bell,
  "rapid-activity": Zap,
  "new-wallet": Wallet,
}

const severityStyles = {
  critical: "border-l-destructive bg-destructive/10",
  high: "border-l-warning bg-warning/10",
  medium: "border-l-chart-2 bg-chart-2/10",
  low: "border-l-success bg-success/10",
}

const severityBadgeStyles = {
  critical: "bg-destructive text-white",
  high: "bg-warning text-white",
  medium: "bg-chart-2 text-white",
  low: "bg-success text-white",
}

export function AlertCard({ alert }: AlertCardProps) {
  const [isAcknowledged, setIsAcknowledged] = useState(false)
  const Icon = alertIcons[alert.type]

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const truncateAddress = (address: string) => {
    if (address.length < 20) return address
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  // Extract wallet ID from address for linking (in real app, would use actual ID)
  const getWalletLink = () => {
    // For demo, link to first wallet
    return "/wallet/1"
  }

  return (
    <div
      className={cn(
        "group rounded-lg border border-l-4 border-border p-4 transition-all duration-200 hover:border-primary/30",
        severityStyles[alert.severity],
        isAcknowledged && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "rounded-lg p-2 transition-colors",
            alert.severity === "critical"
              ? "bg-destructive/20"
              : alert.severity === "high"
                ? "bg-warning/20"
                : "bg-secondary",
          )}
        >
          <Icon
            className={cn(
              "h-4 w-4",
              alert.severity === "critical"
                ? "text-destructive"
                : alert.severity === "high"
                  ? "text-warning"
                  : "text-foreground",
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium uppercase",
                severityBadgeStyles[alert.severity],
              )}
            >
              {alert.severity}
            </span>
            <span className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</span>
          </div>
          <p className="text-sm font-medium text-foreground">{alert.message}</p>
          <Link href={getWalletLink()} className="mt-1 inline-flex items-center gap-1 group/link">
            <code className="font-mono text-xs text-muted-foreground group-hover/link:text-primary transition-colors">
              {truncateAddress(alert.walletAddress)}
            </code>
            <ChevronRight className="h-3 w-3 text-muted-foreground group-hover/link:text-primary transition-colors" />
          </Link>
        </div>

        {/* Action buttons - appear on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsAcknowledged(!isAcknowledged)}
            className={cn(
              "rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
              isAcknowledged && "text-success",
            )}
            title="Acknowledge"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Assign"
          >
            <UserPlus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
