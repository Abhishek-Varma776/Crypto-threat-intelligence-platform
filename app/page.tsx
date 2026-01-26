"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { StatCard } from "@/components/stat-card"
import { ActivityChart } from "@/components/activity-chart"
import { RiskDistribution } from "@/components/risk-distribution"
import { WalletTable } from "@/components/wallet-table"
import { AlertCard } from "@/components/alert-card"
import { mockWallets, mockAlerts, systemStats, osintSourcesList, generateReportCSV } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Wallet, AlertTriangle, Bell, Clock, Database, Link2, Search, Download, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  getStoredStats,
  saveStats,
  getStoredLastScan,
  saveLastScan,
  getStoredIsScanning,
  saveIsScanning,
  DEFAULT_STATS,
  type Stats,
} from "@/lib/store"

export default function DashboardPage() {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [showOsintModal, setShowOsintModal] = useState(false)

  const [stats, setStats] = useState<Stats>(DEFAULT_STATS)
  const [isScanning, setIsScanning] = useState(false)
  const [lastScan, setLastScan] = useState<string | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const storedStats = getStoredStats()
    const storedLastScan = getStoredLastScan()
    const storedIsScanning = getStoredIsScanning()

    setStats(storedStats)
    setLastScan(storedLastScan)
    setIsScanning(storedIsScanning)
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (!isHydrated) return
    saveIsScanning(isScanning)
  }, [isScanning, isHydrated])

  useEffect(() => {
    if (!isScanning || !isHydrated) return

    const interval = setInterval(() => {
      setStats((prev) => {
        const newStats = {
          totalWallets: prev.totalWallets + Math.floor(Math.random() * 5) + 1,
          highRiskCount: prev.highRiskCount + (Math.random() > 0.7 ? 1 : 0),
          alertsToday: prev.alertsToday + (Math.random() > 0.8 ? 1 : 0),
          piiExtracted: prev.piiExtracted + Math.floor(Math.random() * 3),
        }
        saveStats(newStats)
        return newStats
      })
      const newScanTime = new Date().toISOString()
      setLastScan(newScanTime)
      saveLastScan(newScanTime)
    }, 3000)

    return () => clearInterval(interval)
  }, [isScanning, isHydrated])

  const highRiskWallets = mockWallets.filter((w) => w.riskScore >= 75).slice(0, 5)
  const recentAlerts = mockAlerts.slice(0, 3)

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleExportTop100 = () => {
    const top100 = [...mockWallets].sort((a, b) => b.riskScore - a.riskScore).slice(0, 100)
    const csv = generateReportCSV(top100)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `top-100-risk-wallets-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleToggleScanning = () => {
    const newState = !isScanning
    setIsScanning(newState)
    if (newState) {
      const now = new Date().toISOString()
      setLastScan(now)
      saveLastScan(now)
    }
  }

  return (
    <div className={cn("min-h-screen bg-background", isPresentationMode && "presentation-mode")}>
      <Sidebar />
      <TopBar
        onPresentationToggle={() => setIsPresentationMode(!isPresentationMode)}
        isPresentationMode={isPresentationMode}
      />

      <main className="ml-64 pt-14 p-8">
        {/* Header with Quick Actions */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Operations Dashboard</h1>
            <p className="mt-1 text-muted-foreground">System health, active alerts, and quick actions</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className={cn("gap-2 bg-transparent", isScanning && "border-success text-success")}
              onClick={handleToggleScanning}
            >
              <RefreshCw className={cn("h-4 w-4", isScanning && "animate-spin")} />
              {isScanning ? "Stop Scrape" : "Run Scrape"}
            </Button>
            <Button size="sm" className="gap-2" onClick={handleExportTop100}>
              <Download className="h-4 w-4" />
              Export Top 100
            </Button>
          </div>
        </div>

        {/* Stats Grid - Using live stats */}
        <div className="mb-8 grid grid-cols-4 gap-6">
          <StatCard
            title="Total Wallets"
            value={stats.totalWallets}
            subtitle="Across all chains"
            icon={Wallet}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="High-Risk Wallets"
            value={stats.highRiskCount}
            subtitle="Score ≥ 75"
            icon={AlertTriangle}
            variant="danger"
            trend={{ value: 8, isPositive: false }}
          />
          <StatCard
            title="Alerts Today"
            value={stats.alertsToday}
            subtitle="Real-time monitoring"
            icon={Bell}
            variant="warning"
          />
          <StatCard
            title="Last Scan"
            value={formatDate(lastScan)}
            subtitle={isScanning ? "Scanning..." : "Continuous scraping"}
            icon={Clock}
            variant="success"
          />
        </div>

        {/* Charts Row - Pass scanning state for live updates */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <ActivityChart isLive={isScanning} />
          </div>
          <RiskDistribution isLive={isScanning} totalWallets={stats.totalWallets} />
        </div>

        {/* Secondary Stats - Clickable OSINT sources */}
        <div className="mb-8 grid grid-cols-3 gap-6">
          <div onClick={() => setShowOsintModal(true)} className="cursor-pointer">
            <StatCard
              title="OSINT Sources"
              value={systemStats.osintSources}
              subtitle="Click to view sources"
              icon={Search}
              onClick={() => setShowOsintModal(true)}
            />
          </div>
          <StatCard
            title="Chains Monitored"
            value={systemStats.chainsMonitored}
            subtitle="ETH, BTC, TRX, SOL"
            icon={Link2}
          />
          <StatCard
            title="PII Extracted"
            value={stats.piiExtracted}
            subtitle="Emails, phones, usernames"
            icon={Database}
          />
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Top Risk Wallets</h2>
              <a href="/high-risk" className="text-sm text-primary hover:underline">
                View all →
              </a>
            </div>
            <WalletTable wallets={highRiskWallets} />
          </div>
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Live Alerts</h2>
              <a href="/alerts" className="text-sm text-primary hover:underline">
                View all →
              </a>
            </div>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={showOsintModal} onOpenChange={setShowOsintModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>OSINT Sources ({osintSourcesList.length})</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {osintSourcesList.map((source, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-success" />
                {source}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <DemoControl />
    </div>
  )
}
