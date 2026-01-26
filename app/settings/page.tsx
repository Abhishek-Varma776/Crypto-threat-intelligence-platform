"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { Button } from "@/components/ui/button"
import { Bell, Key, Sliders, RefreshCw, Save, Eye, EyeOff, Database, CheckCircle, Square } from "lucide-react"
import { cn } from "@/lib/utils"
import { getStoredLastScan, saveLastScan, getStoredIsScanning, saveIsScanning } from "@/lib/store"

export default function SettingsPage() {
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [highRiskThreshold, setHighRiskThreshold] = useState(75)
  const [criticalThreshold, setCriticalThreshold] = useState(90)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle")

  const [isScraperRunning, setIsScraperRunning] = useState(false)
  const [lastScanDate, setLastScanDate] = useState<string | null>(null)
  const [scrapeInterval, setScrapeInterval] = useState("30")
  const [maxConcurrent, setMaxConcurrent] = useState("10")
  const [isHydrated, setIsHydrated] = useState(false)

  // Alert settings
  const [alertSettings, setAlertSettings] = useState({
    highRisk: true,
    pii: true,
    rapidActivity: true,
    email: false,
  })

  useEffect(() => {
    const storedLastScan = getStoredLastScan()
    const storedIsScanning = getStoredIsScanning()

    setLastScanDate(storedLastScan)
    setIsScraperRunning(storedIsScanning)
    setIsHydrated(true)
  }, [])

  const handleSaveSettings = () => {
    setSaveStatus("saving")
    setTimeout(() => {
      setSaveStatus("saved")
      setTimeout(() => setSaveStatus("idle"), 2000)
    }, 1000)
  }

  const handleToggleScraper = () => {
    const newState = !isScraperRunning
    setIsScraperRunning(newState)
    saveIsScanning(newState)

    if (newState) {
      const now = new Date().toISOString()
      setLastScanDate(now)
      saveLastScan(now)
    }
  }

  useEffect(() => {
    if (!isScraperRunning || !isHydrated) return

    const interval = setInterval(() => {
      const now = new Date().toISOString()
      setLastScanDate(now)
      saveLastScan(now)
    }, 5000)

    return () => clearInterval(interval)
  }, [isScraperRunning, isHydrated])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  return (
    <div className={cn("min-h-screen bg-background", isPresentationMode && "presentation-mode")}>
      <Sidebar />
      <TopBar
        onPresentationToggle={() => setIsPresentationMode(!isPresentationMode)}
        isPresentationMode={isPresentationMode}
      />

      <main className="ml-64 pt-14 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="mt-1 text-muted-foreground">Configure system parameters and alert thresholds</p>
        </div>

        {/* Data Source Status */}
        <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Data Source Status</h2>
            <span className="rounded-full bg-primary/20 px-2.5 py-0.5 text-xs font-medium text-primary">DEMO MODE</span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-lg bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">PostgreSQL</span>
              </div>
              <p className="text-sm font-medium text-foreground">Connected</p>
            </div>
            <div className="rounded-lg bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">Redis</span>
              </div>
              <p className="text-sm font-medium text-foreground">Connected</p>
            </div>
            <div className="rounded-lg bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-sm text-muted-foreground">WebSocket</span>
              </div>
              <p className="text-sm font-medium text-foreground">Active</p>
            </div>
            <div className="rounded-lg bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn("h-2 w-2 rounded-full", isScraperRunning ? "bg-success animate-pulse" : "bg-warning")}
                />
                <span className="text-sm text-muted-foreground">Scheduler</span>
              </div>
              <p className="text-sm font-medium text-foreground">{isScraperRunning ? "Running" : "Stopped"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Risk Thresholds */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <Sliders className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">Risk Thresholds</h2>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">High-Risk Alert Threshold</label>
                  <span className="rounded bg-warning/20 px-2 py-0.5 text-sm font-bold text-warning">
                    {highRiskThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={highRiskThreshold}
                  onChange={(e) => setHighRiskThreshold(Number(e.target.value))}
                  className="w-full accent-warning"
                />
                <p className="mt-1 text-xs text-muted-foreground">Wallets above this score trigger high-risk alerts</p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-foreground">Critical Alert Threshold</label>
                  <span className="rounded bg-destructive/20 px-2 py-0.5 text-sm font-bold text-destructive">
                    {criticalThreshold}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={criticalThreshold}
                  onChange={(e) => setCriticalThreshold(Number(e.target.value))}
                  className="w-full accent-destructive"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Wallets above this score trigger critical alerts with immediate notification
                </p>
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-card-foreground">Alert Settings</h2>
            </div>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div>
                  <span className="text-sm font-medium text-foreground">High-Risk Wallet Alerts</span>
                  <p className="text-xs text-muted-foreground">Notify when wallet score exceeds threshold</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.highRisk}
                  onChange={(e) => setAlertSettings({ ...alertSettings, highRisk: e.target.checked })}
                  className="h-5 w-5 accent-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div>
                  <span className="text-sm font-medium text-foreground">PII Extraction Alerts</span>
                  <p className="text-xs text-muted-foreground">Notify when PII is discovered</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.pii}
                  onChange={(e) => setAlertSettings({ ...alertSettings, pii: e.target.checked })}
                  className="h-5 w-5 accent-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div>
                  <span className="text-sm font-medium text-foreground">Rapid Activity Detection</span>
                  <p className="text-xs text-muted-foreground">Notify on unusual transaction velocity</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.rapidActivity}
                  onChange={(e) => setAlertSettings({ ...alertSettings, rapidActivity: e.target.checked })}
                  className="h-5 w-5 accent-primary"
                />
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div>
                  <span className="text-sm font-medium text-foreground">Email Notifications</span>
                  <p className="text-xs text-muted-foreground">Send alerts to team email</p>
                </div>
                <input
                  type="checkbox"
                  checked={alertSettings.email}
                  onChange={(e) => setAlertSettings({ ...alertSettings, email: e.target.checked })}
                  className="h-5 w-5 accent-primary"
                />
              </label>
            </div>
          </div>

          {/* API Keys */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">API Configuration</h2>
              </div>
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => setShowApiKeys(!showApiKeys)}>
                {showApiKeys ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showApiKeys ? "Hide" : "Show"}
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Etherscan API Key</label>
                <input
                  type={showApiKeys ? "text" : "password"}
                  defaultValue="DEMO_ETHERSCAN_KEY_12345"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">TronScan API Key</label>
                <input
                  type={showApiKeys ? "text" : "password"}
                  defaultValue="DEMO_TRONSCAN_KEY_67890"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Database URL</label>
                <input
                  type={showApiKeys ? "text" : "password"}
                  defaultValue="postgresql://demo:***@localhost:5432/cacs"
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground font-mono placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Scraper Settings */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className={cn("h-5 w-5 text-primary", isScraperRunning && "animate-spin")} />
                <h2 className="text-lg font-semibold text-card-foreground">Scraper Settings</h2>
              </div>
              <Button
                variant={isScraperRunning ? "destructive" : "default"}
                size="sm"
                onClick={handleToggleScraper}
                className="gap-2"
              >
                {isScraperRunning ? (
                  <>
                    <Square className="h-4 w-4" />
                    Stop Scrape
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Run Scrape
                  </>
                )}
              </Button>
            </div>

            <div className="mb-4 p-3 rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Scan</span>
                <span className="text-sm font-medium text-foreground">{formatDate(lastScanDate)}</span>
              </div>
              {isScraperRunning && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                  <span className="text-xs text-success">Scraper is running...</span>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Scrape Interval</label>
                <select
                  value={scrapeInterval}
                  onChange={(e) => setScrapeInterval(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="5">5 minutes</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes (recommended)</option>
                  <option value="60">1 hour</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Maximum Concurrent Scrapers</label>
                <input
                  type="number"
                  value={maxConcurrent}
                  onChange={(e) => setMaxConcurrent(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <label className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary/70 transition-colors">
                <div>
                  <span className="text-sm font-medium text-foreground">Auto-retry Failed Scrapes</span>
                  <p className="text-xs text-muted-foreground">Automatically retry failed scrape jobs</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5 accent-primary" />
              </label>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <Button variant="outline" className="gap-2 bg-transparent">
            Reset to Defaults
          </Button>
          <Button className="gap-2" onClick={handleSaveSettings} disabled={saveStatus === "saving"}>
            {saveStatus === "saving" ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </main>

      <DemoControl />
    </div>
  )
}
