// Mock data for the CACS platform

export interface Wallet {
  id: string
  address: string
  chain: "ETH" | "BTC" | "TRX" | "SOL"
  riskScore: number
  category: "scam" | "phishing" | "mixer" | "ransomware" | "clean" | "unknown"
  txCount: number
  lastTx: string
  firstSeen: string
  lastSeen: string
  osintSnippet: string
  sources: string[]
  pii: {
    kind: string
    value: string
  }[]
  metadata: {
    patterns: string[]
    totalValue: string
    associatedAddresses: number
  }
  transactions?: Transaction[]
}

export interface Transaction {
  id: string
  hash: string
  type: "incoming" | "outgoing"
  amount: string
  currency: string
  from: string
  to: string
  timestamp: string
  status: "confirmed" | "pending"
  fee?: string
  blockNumber?: number
}

export interface Alert {
  id: string
  type: "high-risk" | "suspicious-pii" | "rapid-activity" | "new-wallet"
  message: string
  walletAddress: string
  timestamp: string
  severity: "critical" | "high" | "medium" | "low"
}

export const osintSourcesList = [
  "BitcoinAbuse",
  "ScamAlert.io",
  "CryptoScamDB",
  "PhishTank",
  "ScamAdviser",
  "Reddit r/CryptoScams",
  "Reddit r/Scams",
  "FBI IC3",
  "Chainalysis Reactor",
  "OFAC SDN List",
  "Elliptic",
  "TRM Labs",
  "RugDoc",
  "CipherTrace",
  "BBB Scam Tracker",
  "Whale Alert",
  "TronScan Analytics",
  "Etherscan Labels",
  "DeFiLlama",
  "Twitter/X Reports",
  "Telegram Reports",
  "Discord Reports",
  "Blockchain Forums",
  "Dark Web Monitoring",
]

export const evidencePatterns = {
  BitcoinAbuse: [
    "Reported for investment fraud scheme targeting elderly victims with promises of 300% returns",
    "Multiple victims reported losing funds to fake crypto exchange operated by this address",
    "Address linked to romance scam operation collecting funds from dating app victims",
    "Pig butchering scam wallet - victim reported 6-month relationship before fund loss",
    "Address received funds from victims of fake ICO promising revolutionary DeFi protocol",
  ],
  "ScamAlert.io": [
    "Multiple user reports indicating this address received funds from known phishing campaigns targeting DeFi users",
    "Address flagged for impersonating official Binance support on social media platforms",
    "Wallet associated with fake airdrop scam that collected gas fees from thousands of victims",
    "Reported as destination for funds stolen via malicious smart contract approval",
    "Address linked to rug pull project that drained liquidity pool of $2.5M",
  ],
  "Reddit r/CryptoScams": [
    "Community member reported losing $15,000 after being directed to this wallet by a fake customer support agent on Telegram",
    "User shared evidence of this address being promoted in pump-and-dump Discord group",
    "Multiple Redditors identified this wallet as part of coordinated social engineering attack",
    "Address posted in scam alert thread - connected to fake crypto mining operation",
    "Community investigation revealed this address received funds from 47 confirmed victims",
  ],
  "FBI IC3": [
    "Identified as LockBit 3.0 ransom collection address in federal investigation report",
    "Address listed in active investigation of international cybercrime syndicate",
    "Flagged in money laundering investigation - suspected terrorist financing links",
    "Part of ongoing federal case involving crypto ATM fraud network",
  ],
  "Chainalysis Reactor": [
    "High-risk address with direct exposure to sanctioned entities",
    "Traced funds to known darknet marketplace wallets",
    "Address shows pattern consistent with professional money laundering operation",
    "Mixer interaction detected - funds traced to ransomware collection wallet",
  ],
  "OFAC SDN List": [
    "Address associated with sanctioned individual - transactions prohibited",
    "Listed in connection with North Korean cyber operations",
    "Flagged for potential sanctions evasion activity",
  ],
  Elliptic: [
    "Blockchain analytics identified high-risk transaction patterns",
    "Address linked to known scam cluster affecting 200+ victims",
    "Funds traced through multiple jurisdictions with layering techniques",
  ],
  "TRM Labs": [
    "Risk score elevated due to exposure to illicit services",
    "Address behavior consistent with automated draining wallet",
    "Cross-chain bridge abuse detected originating from this address",
  ],
}

export const indianNames = [
  { name: "Rajesh Kumar", email: "raj***@gmail.com" },
  { name: "Priya Sharma", email: "pri***@yahoo.com" },
  { name: "Amit Patel", email: "ami***@proton.me" },
  { name: "Sneha Gupta", email: "sne***@outlook.com" },
  { name: "Vikram Singh", email: "vik***@gmail.com" },
  { name: "Ananya Desai", email: "ana***@hotmail.com" },
  { name: "Arjun Reddy", email: "arj***@proton.me" },
  { name: "Kavita Nair", email: "kav***@gmail.com" },
  { name: "Suresh Menon", email: "sur***@yahoo.com" },
  { name: "Deepika Joshi", email: "dee***@outlook.com" },
  { name: "Ramesh Iyer", email: "ram***@gmail.com" },
  { name: "Sunita Rao", email: "sun***@proton.me" },
]

function generateTransactions(walletAddress: string, count: number): Transaction[] {
  const transactions: Transaction[] = []
  const currencies = ["ETH", "USDT", "BTC", "TRX"]
  const now = new Date()

  for (let i = 0; i < count; i++) {
    const isIncoming = Math.random() > 0.5
    const date = new Date(now.getTime() - i * 3600000 * Math.random() * 24)
    transactions.push({
      id: `tx-${i}`,
      hash: `0x${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}${Math.random().toString(16).slice(2, 10)}`,
      type: isIncoming ? "incoming" : "outgoing",
      amount: (Math.random() * 10).toFixed(4),
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      from: isIncoming ? `0x${Math.random().toString(16).slice(2, 42)}` : walletAddress,
      to: isIncoming ? walletAddress : `0x${Math.random().toString(16).slice(2, 42)}`,
      timestamp: date.toISOString(),
      status: "confirmed",
      fee: (Math.random() * 0.01).toFixed(6),
      blockNumber: 18000000 + Math.floor(Math.random() * 100000),
    })
  }
  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export const mockWallets: Wallet[] = [
  {
    id: "1",
    address: "0x742d35Cc6634C0532925a3b844Bc9e7595f2BdE1",
    chain: "ETH",
    riskScore: 92,
    category: "scam",
    txCount: 1247,
    lastTx: "2025-12-06T14:30:00Z",
    firstSeen: "2024-03-15T08:00:00Z",
    lastSeen: "2025-12-06T14:30:00Z",
    osintSnippet: "Reported on BitcoinAbuse for investment fraud scheme targeting elderly victims...",
    sources: ["BitcoinAbuse", "ScamAlert.io", "CryptoScamDB", "Twitter Reports"],
    pii: [
      { kind: "name", value: "Rajesh Kumar" },
      { kind: "email", value: "raj***@proton.me" },
      { kind: "username", value: "CryptoKing2024" },
      { kind: "telegram", value: "@fast_profits_btc" },
    ],
    metadata: {
      patterns: ["Rapid incoming transfers", "Immediate mixer routing", "Multiple chain hopping"],
      totalValue: "$2.4M",
      associatedAddresses: 47,
    },
    transactions: generateTransactions("0x742d35Cc6634C0532925a3b844Bc9e7595f2BdE1", 50),
  },
  {
    id: "2",
    address: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
    chain: "TRX",
    riskScore: 88,
    category: "phishing",
    txCount: 892,
    lastTx: "2025-12-05T22:15:00Z",
    firstSeen: "2024-06-20T12:00:00Z",
    lastSeen: "2025-12-05T22:15:00Z",
    osintSnippet: "Associated with fake Binance support phishing campaign on Telegram...",
    sources: ["PhishTank", "ScamAdviser", "Reddit Reports"],
    pii: [
      { kind: "name", value: "Priya Sharma" },
      { kind: "email", value: "pri***@yahoo.com" },
      { kind: "phone", value: "+91-***-***-4521" },
      { kind: "username", value: "BinanceSupport_Real" },
    ],
    metadata: {
      patterns: ["Small test transactions", "Immediate USDT conversion", "CEX deposit patterns"],
      totalValue: "$890K",
      associatedAddresses: 23,
    },
    transactions: generateTransactions("TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7", 40),
  },
  {
    id: "3",
    address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    chain: "BTC",
    riskScore: 95,
    category: "ransomware",
    txCount: 156,
    lastTx: "2025-12-04T09:45:00Z",
    firstSeen: "2024-01-10T00:00:00Z",
    lastSeen: "2025-12-04T09:45:00Z",
    osintSnippet: "Identified as LockBit 3.0 ransom collection address in FBI IC3 report...",
    sources: ["FBI IC3", "Chainalysis Reactor", "OFAC SDN List"],
    pii: [
      { kind: "name", value: "Amit Patel" },
      { kind: "email", value: "lock***@onion.mail" },
    ],
    metadata: {
      patterns: ["Round number deposits", "CoinJoin usage", "Long dormancy periods"],
      totalValue: "$5.2M",
      associatedAddresses: 89,
    },
    transactions: generateTransactions("bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", 30),
  },
  {
    id: "4",
    address: "0x8B3765eDA5207fB21690874B722ae276B96260E0",
    chain: "ETH",
    riskScore: 78,
    category: "mixer",
    txCount: 3421,
    lastTx: "2025-12-06T11:20:00Z",
    firstSeen: "2023-11-05T16:00:00Z",
    lastSeen: "2025-12-06T11:20:00Z",
    osintSnippet: "Tornado Cash interaction wallet with high-volume cross-chain bridging...",
    sources: ["Elliptic", "TRM Labs"],
    pii: [
      { kind: "name", value: "Sneha Gupta" },
      { kind: "email", value: "sne***@outlook.com" },
    ],
    metadata: {
      patterns: ["Tornado Cash deposits", "Cross-chain bridges", "DEX aggregator usage"],
      totalValue: "$12.1M",
      associatedAddresses: 234,
    },
    transactions: generateTransactions("0x8B3765eDA5207fB21690874B722ae276B96260E0", 60),
  },
  {
    id: "5",
    address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
    chain: "SOL",
    riskScore: 45,
    category: "unknown",
    txCount: 567,
    lastTx: "2025-12-06T16:00:00Z",
    firstSeen: "2024-08-12T10:00:00Z",
    lastSeen: "2025-12-06T16:00:00Z",
    osintSnippet: 'Under investigation - possible connection to rug pull project "SolMoon"...',
    sources: ["RugDoc", "Community Reports"],
    pii: [
      { kind: "name", value: "Vikram Singh" },
      { kind: "email", value: "vik***@gmail.com" },
      { kind: "twitter", value: "@sol_dev_anon" },
    ],
    metadata: {
      patterns: ["NFT minting activity", "LP token burns", "Large single transactions"],
      totalValue: "$340K",
      associatedAddresses: 12,
    },
    transactions: generateTransactions("7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU", 25),
  },
  {
    id: "6",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    chain: "ETH",
    riskScore: 15,
    category: "clean",
    txCount: 12500,
    lastTx: "2025-12-06T17:00:00Z",
    firstSeen: "2020-09-17T00:00:00Z",
    lastSeen: "2025-12-06T17:00:00Z",
    osintSnippet: "Verified Uniswap Protocol contract address - legitimate DeFi infrastructure...",
    sources: ["Etherscan Verified", "DeFiLlama"],
    pii: [],
    metadata: {
      patterns: ["Governance token", "High liquidity", "Audited smart contract"],
      totalValue: "$4.2B",
      associatedAddresses: 1000000,
    },
    transactions: generateTransactions("0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 100),
  },
  {
    id: "7",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    chain: "ETH",
    riskScore: 82,
    category: "scam",
    txCount: 432,
    lastTx: "2025-12-05T08:30:00Z",
    firstSeen: "2024-10-01T00:00:00Z",
    lastSeen: "2025-12-05T08:30:00Z",
    osintSnippet: "Pig butchering scam wallet - romance fraud targeting victims on dating apps...",
    sources: ["CipherTrace", "BBB Scam Tracker", "Reddit r/Scams"],
    pii: [
      { kind: "name", value: "Ananya Desai" },
      { kind: "email", value: "ana***@gmail.com" },
      { kind: "phone", value: "+91-****-8821" },
      { kind: "username", value: "InvestWithSarah" },
    ],
    metadata: {
      patterns: ["P2P platform deposits", "Gift card redemptions", "Wire transfer origins"],
      totalValue: "$1.8M",
      associatedAddresses: 31,
    },
    transactions: generateTransactions("0xdAC17F958D2ee523a2206206994597C13D831ec7", 35),
  },
  {
    id: "8",
    address: "TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL",
    chain: "TRX",
    riskScore: 67,
    category: "unknown",
    txCount: 2100,
    lastTx: "2025-12-06T12:00:00Z",
    firstSeen: "2024-04-15T00:00:00Z",
    lastSeen: "2025-12-06T12:00:00Z",
    osintSnippet: "High-volume USDT transfers with potential OTC desk connections...",
    sources: ["Whale Alert", "TronScan Analytics"],
    pii: [
      { kind: "name", value: "Arjun Reddy" },
      { kind: "email", value: "arj***@proton.me" },
    ],
    metadata: {
      patterns: ["Large USDT transfers", "CEX hot wallet interactions", "Regular intervals"],
      totalValue: "$45M",
      associatedAddresses: 156,
    },
    transactions: generateTransactions("TNPeeaaFB7K9cmo4uQpcU32zGK8G1NYqeL", 45),
  },
]

export const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "high-risk",
    message: "New wallet flagged with risk score 92 - Identified scam pattern",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2BdE1",
    timestamp: "2025-12-06T14:35:00Z",
    severity: "critical",
  },
  {
    id: "2",
    type: "suspicious-pii",
    message: "PII extracted: Email address linked to known fraud operator",
    walletAddress: "TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7",
    timestamp: "2025-12-06T14:20:00Z",
    severity: "high",
  },
  {
    id: "3",
    type: "rapid-activity",
    message: "47 transactions detected in last hour - Unusual velocity",
    walletAddress: "0x8B3765eDA5207fB21690874B722ae276B96260E0",
    timestamp: "2025-12-06T14:10:00Z",
    severity: "medium",
  },
  {
    id: "4",
    type: "new-wallet",
    message: "New ransomware-associated wallet added to watchlist",
    walletAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    timestamp: "2025-12-06T13:55:00Z",
    severity: "critical",
  },
  {
    id: "5",
    type: "high-risk",
    message: "Risk score increased from 65 to 82 - New OSINT evidence",
    walletAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    timestamp: "2025-12-06T13:40:00Z",
    severity: "high",
  },
]

export const systemStats = {
  totalWallets: 12847,
  highRiskCount: 892,
  alertsToday: 47,
  lastScanTimestamp: "2025-12-06T14:30:00Z",
  systemHealth: "operational",
  osintSources: 24,
  chainsMonitored: 4,
  piiExtracted: 3421,
}

export function generateReportCSV(wallets: Wallet[]): string {
  const headers = [
    "Address",
    "Chain",
    "Risk Score",
    "Category",
    "Total Value",
    "TX Count",
    "First Seen",
    "Last Seen",
    "Sources",
    "PII Count",
  ]
  const rows = wallets.map((w) => [
    w.address,
    w.chain,
    w.riskScore.toString(),
    w.category,
    w.metadata.totalValue,
    w.txCount.toString(),
    w.firstSeen,
    w.lastSeen,
    w.sources.join("; "),
    w.pii.length.toString(),
  ])
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
}
