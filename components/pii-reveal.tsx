"use client"

import { useState } from "react"
import { Eye, EyeOff, Mail, Phone, User, MessageCircle, AtSign, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PIIItem {
  kind: string
  value: string
  masked: string
}

interface PIIRevealProps {
  items: PIIItem[]
}

const piiIcons: Record<string, typeof Mail> = {
  email: Mail,
  phone: Phone,
  username: User,
  telegram: MessageCircle,
  twitter: AtSign,
}

export function PIIReveal({ items }: PIIRevealProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [showConfirm, setShowConfirm] = useState<number | null>(null)

  const handleRevealRequest = (index: number) => {
    setShowConfirm(index)
  }

  const handleConfirmReveal = (index: number) => {
    const newRevealed = new Set(revealed)
    newRevealed.add(index)
    setRevealed(newRevealed)
    setShowConfirm(null)
  }

  const handleHide = (index: number) => {
    const newRevealed = new Set(revealed)
    newRevealed.delete(index)
    setRevealed(newRevealed)
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Extracted PII</h3>
        <p className="text-sm text-muted-foreground">No PII extracted for this wallet.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">Extracted PII</h3>
        <span className="rounded-full bg-warning/20 px-2 py-0.5 text-xs font-medium text-warning">
          {items.length} found
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = piiIcons[item.kind] || User
          const isRevealed = revealed.has(index)
          const isConfirming = showConfirm === index

          return (
            <div
              key={index}
              className={cn(
                "relative rounded-lg border p-4 transition-all duration-200",
                isRevealed ? "border-warning/50 bg-warning/5" : "border-border bg-secondary/50",
              )}
            >
              {/* Confirmation overlay */}
              {isConfirming && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-card/95 backdrop-blur-sm">
                  <div className="text-center p-4">
                    <AlertTriangle className="h-8 w-8 text-warning mx-auto mb-2" />
                    <p className="text-sm font-medium text-foreground mb-3">Reveal sensitive data?</p>
                    <div className="flex items-center gap-2 justify-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-transparent"
                        onClick={() => setShowConfirm(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="bg-warning text-warning-foreground hover:bg-warning/90"
                        onClick={() => handleConfirmReveal(index)}
                      >
                        Reveal
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className={cn("rounded-lg p-2", isRevealed ? "bg-warning/20" : "bg-primary/20")}>
                  <Icon className={cn("h-4 w-4", isRevealed ? "text-warning" : "text-primary")} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase text-muted-foreground mb-1">{item.kind}</p>
                  <p
                    className={cn(
                      "font-mono text-sm transition-all duration-200",
                      isRevealed ? "text-foreground" : "text-muted-foreground blur-sm select-none",
                    )}
                  >
                    {isRevealed ? item.value : item.masked}
                  </p>
                </div>

                <button
                  onClick={() => (isRevealed ? handleHide(index) : handleRevealRequest(index))}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {isRevealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <p className="mt-4 text-xs text-muted-foreground text-center">
        PII data is masked by default. Click reveal to view sensitive information.
      </p>
    </div>
  )
}
