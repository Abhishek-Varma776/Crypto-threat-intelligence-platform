import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"
import { DemoControl } from "@/components/demo-control"
import { RiskBadge } from "@/components/risk-badge"
import { ChainBadge } from "@/components/chain-badge"
import { NetworkGraph } from "@/components/network-graph"
import { EvidenceTimeline } from "@/components/evidence-timeline"
import { RiskBreakdown, defaultRiskFactors } from "@/components/risk-breakdown"
import { PIIReveal } from "@/components/pii-reveal"
import { TransactionHistory } from "@/components/transaction-history"
import { mockWallets, evidencePatterns } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Copy,
  Download,
  ExternalLink,
  Activity,
  Clock,
  Hash,
  Link2,
  AlertTriangle,
  FileText,
  CheckCircle,
  Flag,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function WalletDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const wallet = mockWallets.find((w) => w.id === id)

  if (!wallet) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEvidenceForSource = (source: string, index: number) => {
    const patterns = evidencePatterns[source as keyof typeof evidencePatterns] || [wallet.osintSnippet]
    return patterns[index % patterns.length]
  }

  const evidenceItems = wallet.sources.map((source, index) => ({
    id: `${index + 1}`,
    source,
    snippet: getEvidenceForSource(source, index),
    timestamp: new Date(Date.now() - index * 86400000).toISOString(),
    credibility: (index === 0 ? "high" : index === 1 ? "high" : "medium") as "high" | "medium" | "low",
    url: `https://${source.toLowerCase().replace(/\s+/g, "")}.com`,
    highlights: source.includes("FBI")
      ? ["federal investigation", "ransomware"]
      : source.includes("Reddit")
        ? ["community report", "victim testimony"]
        : ["scam alert", "fraud pattern"],
  }))

  const graphNodes = [
    { id: wallet.address, label: wallet.address, type: "wallet" as const, risk: wallet.riskScore },
    ...wallet.pii.map((p, i) => ({
      id: `pii-${i}`,
      label: p.value,
      type: "pii" as const,
    })),
    { id: "mixer-1", label: "Tornado Cash", type: "entity" as const },
    { id: "wallet-2", label: "0x8B37...60E0", type: "wallet" as const, risk: 78 },
  ]

  const graphEdges = [
    ...wallet.pii.map((_, i) => ({
      source: wallet.address,
      target: `pii-${i}`,
    })),
    { source: wallet.address, target: "mixer-1" },
    { source: "mixer-1", target: "wallet-2" },
  ]

  const piiItems = wallet.pii.map((p) => ({
    kind: p.kind,
    value: p.value,
    masked: p.value.replace(/[a-zA-Z0-9]/g, (char, i) => (i % 3 === 0 ? char : "*")),
  }))

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopBarWrapper />

      <main className="ml-64 pt-14 p-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/wallets"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Wallets
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground">Wallet Investigation</h1>
                <RiskBadge score={wallet.riskScore} size="lg" />
              </div>
              <div className="mt-3 flex items-center gap-3">
                <code className="rounded-lg bg-secondary px-4 py-2 font-mono text-sm text-foreground">
                  {wallet.address}
                </code>
                <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <Copy className="h-4 w-4" />
                </button>
                <ChainBadge chain={wallet.chain} />
                <a href="#" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  View on Explorer
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 bg-transparent">
                <CheckCircle className="h-4 w-4" />
                Mark Verified
              </Button>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Flag className="h-4 w-4" />
                Raise Alert
              </Button>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Left Column - Evidence & Timeline (60%) */}
          <div className="col-span-3 space-y-6">
            {/* OSINT Evidence Timeline - Different patterns */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">OSINT Evidence Timeline</h2>
              </div>
              <EvidenceTimeline evidence={evidenceItems} />
            </div>

            {/* Blockchain Data */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-card-foreground">Blockchain Summary</h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    <span className="text-xs uppercase">Transactions</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">{wallet.txCount.toLocaleString()}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span className="text-xs uppercase">Last TX</span>
                  </div>
                  <p className="mt-2 text-sm font-medium text-foreground">{formatDate(wallet.lastTx)}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Link2 className="h-4 w-4" />
                    <span className="text-xs uppercase">Connected</span>
                  </div>
                  <p className="mt-2 text-2xl font-bold text-foreground">{wallet.metadata.associatedAddresses}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs uppercase">Mixer Flag</span>
                  </div>
                  <p className="mt-2 text-lg font-bold text-destructive">
                    {wallet.metadata.patterns.some((p) => p.toLowerCase().includes("mixer")) ? "YES" : "NO"}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Detected Patterns</h3>
                <div className="flex flex-wrap gap-2">
                  {wallet.metadata.patterns.map((pattern, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive"
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {pattern}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <TransactionHistory transactions={wallet.transactions || []} walletAddress={wallet.address} />

            {/* PII Section - With Indian names */}
            <PIIReveal items={piiItems} />
          </div>

          {/* Right Column - Metrics & Graph (40%) */}
          <div className="col-span-2 space-y-6">
            {/* Risk Breakdown */}
            <RiskBreakdown overallScore={wallet.riskScore} factors={defaultRiskFactors} />

            {/* Network Graph */}
            <NetworkGraph nodes={graphNodes} edges={graphEdges} />

            {/* Quick Stats */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Category</span>
                  <span className="rounded-md bg-destructive/20 px-2 py-0.5 text-sm font-medium capitalize text-destructive">
                    {wallet.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Value</span>
                  <span className="text-sm font-medium text-foreground">{wallet.metadata.totalValue}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">First Seen</span>
                  <span className="text-sm text-foreground">{new Date(wallet.firstSeen).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Seen</span>
                  <span className="text-sm text-foreground">{new Date(wallet.lastSeen).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Sources</span>
                  <span className="text-sm text-foreground">{wallet.sources.length} verified</span>
                </div>
              </div>
            </div>

            {/* External Links */}
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-card-foreground">External Links</h2>
              <div className="space-y-2">
                <a
                  href="#"
                  className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                >
                  <span className="text-sm text-foreground">View on Explorer</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                >
                  <span className="text-sm text-foreground">Chainalysis Report</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href="#"
                  className="flex items-center justify-between rounded-lg bg-secondary/50 p-3 transition-colors hover:bg-secondary"
                >
                  <span className="text-sm text-foreground">OFAC Check</span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DemoControlWrapper />
    </div>
  )
}

function TopBarWrapper() {
  "use client"
  return <TopBar />
}

function DemoControlWrapper() {
  "use client"
  return <DemoControl />
}
