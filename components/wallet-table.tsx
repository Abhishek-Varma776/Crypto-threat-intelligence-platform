"use client"

import type React from "react"

import Link from "next/link"
import type { Wallet } from "@/lib/mock-data"
import { RiskBadge } from "./risk-badge"
import { ChainBadge } from "./chain-badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Copy, Check } from "lucide-react"
import { useState } from "react"

interface WalletTableProps {
  wallets: Wallet[]
  showRisk?: boolean
  clickableAddresses?: boolean
}

export function WalletTable({ wallets, showRisk = true, clickableAddresses = true }: WalletTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyAddress = (address: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(address)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 10)}...${address.slice(-8)}`
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Address
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Chain
            </th>
            {showRisk && (
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Risk Score
              </th>
            )}
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sources
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Last Seen
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {wallets.map((wallet) => (
            <tr key={wallet.id} className="transition-colors hover:bg-secondary/30">
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {clickableAddresses ? (
                    <Link
                      href={`/wallet/${wallet.id}`}
                      className="font-mono text-sm text-primary hover:underline cursor-pointer"
                    >
                      {truncateAddress(wallet.address)}
                    </Link>
                  ) : (
                    <code className="font-mono text-sm text-foreground">{truncateAddress(wallet.address)}</code>
                  )}
                  <button
                    onClick={(e) => copyAddress(wallet.address, wallet.id, e)}
                    className="rounded p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {copiedId === wallet.id ? <Check className="h-4 w-4 text-primary" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </td>
              <td className="px-6 py-4">
                <ChainBadge chain={wallet.chain} />
              </td>
              {showRisk && (
                <td className="px-6 py-4">
                  <RiskBadge score={wallet.riskScore} />
                </td>
              )}
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium capitalize text-secondary-foreground">
                  {wallet.category}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">{wallet.sources.length} sources</span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-muted-foreground">{formatDate(wallet.lastSeen)}</span>
              </td>
              <td className="px-6 py-4 text-right">
                <Link href={`/wallet/${wallet.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    View <ExternalLink className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
