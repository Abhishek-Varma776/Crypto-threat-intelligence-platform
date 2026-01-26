"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Copy, Check, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClickableAddressProps {
  address: string
  walletId?: string
  truncate?: boolean
  showCopy?: boolean
  showExternal?: boolean
  className?: string
}

export function ClickableAddress({
  address,
  walletId,
  truncate = true,
  showCopy = true,
  showExternal = false,
  className,
}: ClickableAddressProps) {
  const [copied, setCopied] = useState(false)

  const displayAddress = truncate ? `${address.slice(0, 10)}...${address.slice(-8)}` : address

  const copyAddress = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      {walletId ? (
        <Link href={`/wallet/${walletId}`} className="font-mono text-sm text-primary hover:underline cursor-pointer">
          {displayAddress}
        </Link>
      ) : (
        <code className="font-mono text-sm text-foreground">{displayAddress}</code>
      )}
      {showCopy && (
        <button
          onClick={copyAddress}
          className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
      {showExternal && (
        <a
          href="#"
          className="p-1 rounded text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}
    </span>
  )
}
