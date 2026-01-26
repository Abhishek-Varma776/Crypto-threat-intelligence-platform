"use client"

import { useState, useEffect, useMemo } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { LiveStreamCard } from "@/components/live-stream-card"
import { WalletTable } from "@/components/wallet-table"
import { mockWallets, type Wallet } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, Search, LayoutGrid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export default function WalletsPage() {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [viewMode, setViewMode] = useState<"stream" | "table">("stream")
  const [wallets, setWallets] = useState<Wallet[]>(mockWallets)
  const [newWalletIds, setNewWalletIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [chainFilter, setChainFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [minRisk, setMinRisk] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomWallet = mockWallets[Math.floor(Math.random() * mockWallets.length)]
      const newWallet: Wallet = {
        ...randomWallet,
        id: Date.now().toString(),
        firstSeen: new Date().toISOString(),
        lastSeen: new Date().toISOString(),
        address: `0x${Math.random().toString(16).slice(2, 10)}${randomWallet.address.slice(10)}`,
      }

      setWallets((prev) => [newWallet, ...prev].slice(0, 50))
      setNewWalletIds((prev) => new Set([newWallet.id, ...prev]))

      setTimeout(() => {
        setNewWalletIds((prev) => {
          const next = new Set(prev)
          next.delete(newWallet.id)
          return next
        })
      }, 5000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const filteredWallets = useMemo(() => {
    return wallets.filter((w) => {
      const matchesSearch =
        w.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.osintSnippet.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesChain = !chainFilter || w.chain === chainFilter
      const matchesCategory = !categoryFilter || w.category === categoryFilter
      const matchesRisk = w.riskScore >= minRisk
      return matchesSearch && matchesChain && matchesCategory && matchesRisk
    })
  }, [wallets, searchQuery, chainFilter, categoryFilter, minRisk])

  return (
    <div className={cn("min-h-screen bg-background", isPresentationMode && "presentation-mode")}>
      <Sidebar />
      <TopBar
        onPresentationToggle={() => setIsPresentationMode(!isPresentationMode)}
        isPresentationMode={isPresentationMode}
      />

      <main className="ml-64 pt-14 p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Latest Wallets</h1>
            <p className="mt-1 text-muted-foreground">Live feed of newly discovered cryptocurrency addresses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-lg border border-border bg-secondary p-1">
              <button
                onClick={() => setViewMode("stream")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  viewMode === "stream"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-4 py-3">
          <div className="relative">
            <div className="h-2 w-2 rounded-full bg-success" />
            <div className="absolute inset-0 h-2 w-2 rounded-full bg-success animate-ping" />
          </div>
          <span className="text-sm font-medium text-success">Live Stream Active</span>
          <span className="text-sm text-muted-foreground">— New wallets will appear automatically</span>
        </div>

        <div className="mb-6 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by address, category, or source..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <select
            value={chainFilter}
            onChange={(e) => setChainFilter(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Chains</option>
            <option value="ETH">Ethereum</option>
            <option value="BTC">Bitcoin</option>
            <option value="TRX">Tron</option>
            <option value="SOL">Solana</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="scam">Scam</option>
            <option value="phishing">Phishing</option>
            <option value="mixer">Mixer</option>
            <option value="ransomware">Ransomware</option>
            <option value="clean">Clean</option>
            <option value="unknown">Unknown</option>
          </select>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary px-3 py-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">Min Risk:</span>
            <input
              type="range"
              min="0"
              max="100"
              value={minRisk}
              onChange={(e) => setMinRisk(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            <span className="text-sm font-medium text-foreground w-8">{minRisk}</span>
          </div>
          {(searchQuery || chainFilter || categoryFilter || minRisk > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setChainFilter("")
                setCategoryFilter("")
                setMinRisk(0)
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

        {viewMode === "stream" ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredWallets.map((wallet) => (
              <LiveStreamCard key={wallet.id} wallet={wallet} isNew={newWalletIds.has(wallet.id)} />
            ))}
          </div>
        ) : (
          <WalletTable wallets={filteredWallets} />
        )}

        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-foreground">{filteredWallets.length}</span> wallets
            {minRisk > 0 && <span> with risk ≥ {minRisk}</span>}
          </p>
        </div>
      </main>

      <DemoControl />
    </div>
  )
}
