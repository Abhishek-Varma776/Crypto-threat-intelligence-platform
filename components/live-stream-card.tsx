"use client"

import { cn } from "@/lib/utils"
import { RiskBadge } from "./risk-badge"
import { ChainBadge } from "./chain-badge"
import type { Wallet } from "@/lib/mock-data"
import { ExternalLink, Copy, Check } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface LiveStreamCardProps {
  wallet: Wallet
  isNew?: boolean
}

export function LiveStreamCard({ wallet, isNew }: LiveStreamCardProps) {
  const [copied, setCopied] = useState(false)

  const copyAddress = () => {
    navigator.clipboard.writeText(wallet.address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-4 transition-all duration-300",
        isNew && "animate-slide-in border-primary/50 shadow-lg shadow-primary/10",
      )}
    >
      {/* New indicator */}
      {isNew && (
        <div className="mb-3 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          <span className="text-xs font-medium text-success">NEW</span>
          <span className="text-xs text-muted-foreground">{formatTime(wallet.firstSeen)}</span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <code className="font-mono text-sm text-foreground">{truncateAddress(wallet.address)}</code>
            <button
              onClick={copyAddress}
              className="rounded p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <ChainBadge chain={wallet.chain} />
            <RiskBadge score={wallet.riskScore} />
            <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium capitalize text-secondary-foreground">
              {wallet.category}
            </span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{wallet.osintSnippet}</p>
        </div>

        <Link
          href={`/wallet/${wallet.id}`}
          className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
        >
          View
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="mt-3 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
        <span>{wallet.sources.length} sources</span>
        <span>{wallet.txCount.toLocaleString()} transactions</span>
        <span>{wallet.pii.length} PII extracted</span>
      </div>
    </div>
  )
}
