"use client"

import { useState } from "react"
import type { Transaction } from "@/lib/mock-data"
import {
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Link2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface TransactionHistoryProps {
  transactions: Transaction[]
  walletAddress: string
  isCritical?: boolean
}

function findCrimePatterns(transactions: Transaction[]): Map<string, string[]> {
  const patterns = new Map<string, string[]>()

  for (let i = 0; i < transactions.length; i++) {
    for (let j = i + 1; j < transactions.length; j++) {
      const tx1 = transactions[i]
      const tx2 = transactions[j]

      // Check if same timestamp (within 1 minute) and same amount but opposite directions
      const time1 = new Date(tx1.timestamp).getTime()
      const time2 = new Date(tx2.timestamp).getTime()
      const timeDiff = Math.abs(time1 - time2)

      if (
        timeDiff <= 60000 && // Within 1 minute
        tx1.amount === tx2.amount &&
        tx1.type !== tx2.type // One incoming, one outgoing
      ) {
        const patternKey = `${tx1.timestamp}-${tx1.amount}`
        patterns.set(tx1.id, [tx2.id])
        patterns.set(tx2.id, [tx1.id])
      }
    }
  }

  return patterns
}

export function TransactionHistory({ transactions, walletAddress, isCritical = false }: TransactionHistoryProps) {
  const [showAll, setShowAll] = useState(false)
  const [copiedHash, setCopiedHash] = useState<string | null>(null)

  const displayedTransactions = showAll ? transactions : transactions.slice(0, 10)

  const crimePatterns = isCritical ? findCrimePatterns(transactions) : new Map()

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHash(hash)
    setTimeout(() => setCopiedHash(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 8)}...${address.slice(-6)}`
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-card-foreground">Transaction History</h2>
          {isCritical && crimePatterns.size > 0 && (
            <span className="flex items-center gap-1.5 rounded-md bg-destructive/20 px-2 py-1 text-xs font-medium text-destructive">
              <AlertTriangle className="h-3 w-3" />
              {crimePatterns.size / 2} Crime Patterns Detected
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{transactions.length} total transactions</span>
      </div>

      {isCritical && crimePatterns.size > 0 && (
        <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3">
          <div className="flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Crime Pattern Analysis
          </div>
          <p className="mt-1 text-xs text-destructive/80">
            Transactions highlighted in red show simultaneous debit/credit with matching amounts - a common money
            laundering indicator. Same timestamp + same amount + opposite direction = potential layering activity.
          </p>
        </div>
      )}

      <div className="space-y-2">
        {displayedTransactions.map((tx) => {
          const isPartOfCrimePattern = crimePatterns.has(tx.id)

          return (
            <div
              key={tx.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg transition-colors",
                isPartOfCrimePattern
                  ? "bg-destructive/20 border border-destructive/40 hover:bg-destructive/30"
                  : "bg-secondary/30 hover:bg-secondary/50",
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "rounded-full p-2",
                    tx.type === "incoming" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive",
                  )}
                >
                  {tx.type === "incoming" ? (
                    <ArrowDownLeft className="h-4 w-4" />
                  ) : (
                    <ArrowUpRight className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn("font-medium", tx.type === "incoming" ? "text-success" : "text-destructive")}>
                      {tx.type === "incoming" ? "+" : "-"}
                      {tx.amount} {tx.currency}
                    </span>
                    <span className="text-xs text-muted-foreground">{formatDate(tx.timestamp)}</span>
                    {isPartOfCrimePattern && (
                      <span className="flex items-center gap-1 rounded bg-destructive px-1.5 py-0.5 text-xs font-bold text-white">
                        <Link2 className="h-3 w-3" />
                        MATCHED
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{tx.type === "incoming" ? "From:" : "To:"}</span>
                    <Link
                      href={`/wallet/${tx.type === "incoming" ? "1" : "2"}`}
                      className="font-mono text-xs text-primary hover:underline"
                    >
                      {truncateAddress(tx.type === "incoming" ? tx.from : tx.to)}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right mr-3">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span>Hash:</span>
                    <code className="font-mono">{tx.hash.slice(0, 10)}...</code>
                    <button
                      onClick={() => copyHash(tx.hash)}
                      className="p-1 hover:bg-secondary rounded transition-colors"
                    >
                      {copiedHash === tx.hash ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  {tx.blockNumber && (
                    <span className="text-xs text-muted-foreground">Block #{tx.blockNumber.toLocaleString()}</span>
                  )}
                </div>
                <a
                  href="#"
                  className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {transactions.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium text-foreground"
        >
          {showAll ? (
            <>
              Show Less <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              Show All {transactions.length} Transactions <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
