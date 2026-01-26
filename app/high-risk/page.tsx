"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { WalletTable } from "@/components/wallet-table"
import { StatCard } from "@/components/stat-card"
import { mockWallets, generateReportCSV } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Download, AlertTriangle, TrendingUp, Shield, Target, CheckSquare, FolderPlus } from "lucide-react"
import { cn } from "@/lib/utils"

export default function HighRiskPage() {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [selectedWallets, setSelectedWallets] = useState<Set<string>>(new Set())

  const [stats, setStats] = useState({
    criticalCount: mockWallets.filter((w) => w.riskScore >= 90).length,
    scamCount: mockWallets.filter((w) => w.category === "scam").length,
    ransomwareCount: mockWallets.filter((w) => w.category === "ransomware").length,
    weeklyTrend: 23,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => ({
        criticalCount: prev.criticalCount + (Math.random() > 0.8 ? 1 : 0),
        scamCount: prev.scamCount + (Math.random() > 0.7 ? 1 : 0),
        ransomwareCount: prev.ransomwareCount + (Math.random() > 0.9 ? 1 : 0),
        weeklyTrend: prev.weeklyTrend + (Math.random() > 0.5 ? 1 : -1),
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const highRiskWallets = mockWallets.filter((w) => w.riskScore >= 75)

  const handleExportReport = () => {
    const csv = generateReportCSV(highRiskWallets)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `high-risk-wallets-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

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
            <h1 className="text-3xl font-bold text-foreground">High-Risk Wallets</h1>
            <p className="mt-1 text-muted-foreground">Wallets with risk score ≥ 75 requiring immediate attention</p>
          </div>
          <div className="flex items-center gap-3">
            {selectedWallets.size > 0 && (
              <div className="flex items-center gap-2 mr-4 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-sm text-primary font-medium">{selectedWallets.size} selected</span>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-primary">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Verify
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-primary">
                  <FolderPlus className="h-3.5 w-3.5" />
                  Add to Case
                </Button>
              </div>
            )}
            <Button
              className="gap-2 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleExportReport}
            >
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-4 gap-6">
          <StatCard
            title="Critical Threats"
            value={stats.criticalCount}
            subtitle="Score ≥ 90"
            icon={AlertTriangle}
            variant="danger"
          />
          <StatCard
            title="Scam Wallets"
            value={stats.scamCount}
            subtitle="Investment fraud, pig butchering"
            icon={Target}
            variant="warning"
          />
          <StatCard
            title="Ransomware"
            value={stats.ransomwareCount}
            subtitle="OFAC listed"
            icon={Shield}
            variant="danger"
          />
          <StatCard
            title="Weekly Trend"
            value={`+${stats.weeklyTrend}%`}
            subtitle="vs last week"
            icon={TrendingUp}
            variant="warning"
          />
        </div>

        <div className="mb-6 rounded-xl border border-border bg-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">Risk Score Legend</h3>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-destructive" />
              <span className="text-sm text-muted-foreground">Critical (90-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-warning" />
              <span className="text-sm text-muted-foreground">High (75-89)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-chart-2" />
              <span className="text-sm text-muted-foreground">Medium (50-74)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded bg-success" />
              <span className="text-sm text-muted-foreground">Low (0-49)</span>
            </div>
          </div>
        </div>

        <WalletTable wallets={highRiskWallets} clickableAddresses />
      </main>

      <DemoControl />
    </div>
  )
}
