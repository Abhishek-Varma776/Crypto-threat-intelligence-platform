"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  FolderOpen,
  Plus,
  Search,
  Calendar,
  User,
  MoreVertical,
  Download,
  Share2,
  ChevronRight,
  AlertTriangle,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockWallets, generateReportCSV } from "@/lib/mock-data"
import Link from "next/link"

interface CaseFile {
  id: string
  name: string
  description: string
  status: "open" | "investigating" | "closed"
  priority: "critical" | "high" | "medium" | "low"
  wallets: string[]
  createdAt: string
  updatedAt: string
  assignee: string
  notes: string
  evidence: string[]
}

const mockCases: CaseFile[] = [
  {
    id: "1",
    name: "LockBit 3.0 Ransom Network",
    description: "Investigation into ransomware payment collection network spanning multiple chains",
    status: "investigating",
    priority: "critical",
    wallets: ["1", "3"],
    createdAt: "2025-12-01T08:00:00Z",
    updatedAt: "2025-12-06T14:30:00Z",
    assignee: "Agent Smith",
    notes:
      "Primary collection wallet identified. Funds traced through 3 intermediate addresses before reaching mixer. Working with FBI IC3 on attribution.",
    evidence: ["FBI IC3 Report #2025-1234", "Chainalysis Reactor Analysis", "Victim Statement - Company XYZ"],
  },
  {
    id: "2",
    name: "Pig Butchering Ring #47",
    description: "Romance scam operation targeting dating app users with fake investment schemes",
    status: "open",
    priority: "high",
    wallets: ["7"],
    createdAt: "2025-12-03T10:00:00Z",
    updatedAt: "2025-12-06T11:00:00Z",
    assignee: "Agent Johnson",
    notes:
      "47 victims identified across 12 countries. Total losses estimated at $3.2M. Primary suspect located in SE Asia.",
    evidence: ["Victim Interviews (47)", "Telegram Chat Logs", "Dating App Profile Screenshots"],
  },
  {
    id: "3",
    name: "Binance Phishing Campaign",
    description: "Fake customer support scam collecting credentials via Telegram",
    status: "investigating",
    priority: "high",
    wallets: ["2"],
    createdAt: "2025-11-28T14:00:00Z",
    updatedAt: "2025-12-05T16:00:00Z",
    assignee: "Agent Smith",
    notes: "Phishing kit analysis complete. Infrastructure hosted on bulletproof hosting in Moldova.",
    evidence: ["Phishing Kit Source Code", "Domain Registration Records", "Telegram Bot Analysis"],
  },
  {
    id: "4",
    name: "DeFi Rug Pull - SolMoon",
    description: "Suspected rug pull investigation involving NFT minting and LP token burns",
    status: "closed",
    priority: "medium",
    wallets: ["5"],
    createdAt: "2025-11-15T09:00:00Z",
    updatedAt: "2025-11-30T17:00:00Z",
    assignee: "Agent Williams",
    notes: "Case closed. Developer identified and assets frozen by law enforcement. Recovery proceedings initiated.",
    evidence: ["Smart Contract Audit", "Developer Wallet Trace", "Discord Server Archive"],
  },
]

const statusConfig = {
  open: { label: "Open", color: "bg-chart-2 text-white" },
  investigating: { label: "Investigating", color: "bg-warning text-white" },
  closed: { label: "Closed", color: "bg-muted text-muted-foreground" },
}

const priorityConfig = {
  critical: { color: "text-destructive", bg: "bg-destructive/20" },
  high: { color: "text-warning", bg: "bg-warning/20" },
  medium: { color: "text-chart-2", bg: "bg-chart-2/20" },
  low: { color: "text-success", bg: "bg-success/20" },
}

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [selectedCase, setSelectedCase] = useState<CaseFile | null>(null)
  const [copiedLink, setCopiedLink] = useState(false)

  const filteredCases = mockCases.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || c.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleExportCase = (caseFile: CaseFile) => {
    const caseWallets = mockWallets.filter((w) => caseFile.wallets.includes(w.id))
    const csv = generateReportCSV(caseWallets)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `case-${caseFile.name.replace(/\s+/g, "-").toLowerCase()}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShareCase = (caseFile: CaseFile) => {
    const shareUrl = `${window.location.origin}/cases/${caseFile.id}`
    navigator.clipboard.writeText(shareUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const getCaseWallets = (caseFile: CaseFile) => {
    return mockWallets.filter((w) => caseFile.wallets.includes(w.id))
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
            <h1 className="text-3xl font-bold text-foreground">Investigations</h1>
            <p className="mt-1 text-muted-foreground">Case files and saved investigation reports</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Case
          </Button>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2">
            {["all", "open", "investigating", "closed"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  statusFilter === status
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {filteredCases.map((caseFile) => (
            <div
              key={caseFile.id}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={cn("rounded-lg p-2", priorityConfig[caseFile.priority].bg)}>
                    <FolderOpen className={cn("h-5 w-5", priorityConfig[caseFile.priority].color)} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {caseFile.name}
                    </h3>
                    <span
                      className={cn(
                        "inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-medium",
                        statusConfig[caseFile.status].color,
                      )}
                    >
                      {statusConfig[caseFile.status].label}
                    </span>
                  </div>
                </div>

                <button className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{caseFile.description}</p>

              <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-1.5">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>{caseFile.wallets.length} wallets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  <span>{caseFile.assignee}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(caseFile.updatedAt)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => handleExportCase(caseFile)}>
                    <Download className="h-3.5 w-3.5" />
                    Export
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={() => handleShareCase(caseFile)}>
                    <Share2 className="h-3.5 w-3.5" />
                    {copiedLink ? "Copied!" : "Share"}
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1.5 text-primary"
                  onClick={() => setSelectedCase(caseFile)}
                >
                  Open Case
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredCases.length === 0 && (
          <div className="text-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No cases found</h3>
            <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedCase && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("rounded-lg p-2", priorityConfig[selectedCase.priority].bg)}>
                      <FolderOpen className={cn("h-6 w-6", priorityConfig[selectedCase.priority].color)} />
                    </div>
                    <div>
                      <DialogTitle className="text-xl">{selectedCase.name}</DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            statusConfig[selectedCase.status].color,
                          )}
                        >
                          {statusConfig[selectedCase.status].label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Priority: {selectedCase.priority.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedCase.description}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Case Notes</h4>
                  <p className="text-sm text-muted-foreground bg-secondary/50 rounded-lg p-3">{selectedCase.notes}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Assignee</span>
                        <span className="text-foreground">{selectedCase.assignee}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created</span>
                        <span className="text-foreground">{formatDate(selectedCase.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated</span>
                        <span className="text-foreground">{formatDate(selectedCase.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Evidence ({selectedCase.evidence.length})
                    </h4>
                    <div className="space-y-1">
                      {selectedCase.evidence.map((item, i) => (
                        <div key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Associated Wallets ({getCaseWallets(selectedCase).length})
                  </h4>
                  <div className="space-y-2">
                    {getCaseWallets(selectedCase).map((wallet) => (
                      <Link
                        key={wallet.id}
                        href={`/wallet/${wallet.id}`}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <code className="font-mono text-sm text-primary">
                            {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                          </code>
                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-xs font-medium",
                              wallet.riskScore >= 90
                                ? "bg-destructive/20 text-destructive"
                                : wallet.riskScore >= 75
                                  ? "bg-warning/20 text-warning"
                                  : "bg-success/20 text-success",
                            )}
                          >
                            Risk: {wallet.riskScore}
                          </span>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                  <Button variant="outline" onClick={() => handleExportCase(selectedCase)}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Case
                  </Button>
                  <Button variant="outline" onClick={() => handleShareCase(selectedCase)}>
                    <Share2 className="h-4 w-4 mr-2" />
                    {copiedLink ? "Link Copied!" : "Share Link"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <DemoControl />
    </div>
  )
}
