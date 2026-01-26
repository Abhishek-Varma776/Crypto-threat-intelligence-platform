import { cn } from "@/lib/utils"

interface ChainBadgeProps {
  chain: "ETH" | "BTC" | "TRX" | "SOL"
  showIcon?: boolean
}

const chainConfig = {
  ETH: {
    label: "Ethereum",
    short: "ETH",
    color: "bg-[#627EEA]/20 text-[#627EEA] border-[#627EEA]/30",
    icon: "◆",
  },
  BTC: {
    label: "Bitcoin",
    short: "BTC",
    color: "bg-[#F7931A]/20 text-[#F7931A] border-[#F7931A]/30",
    icon: "₿",
  },
  TRX: {
    label: "Tron",
    short: "TRX",
    color: "bg-[#EF0027]/20 text-[#EF0027] border-[#EF0027]/30",
    icon: "◎",
  },
  SOL: {
    label: "Solana",
    short: "SOL",
    color: "bg-[#9945FF]/20 text-[#9945FF] border-[#9945FF]/30",
    icon: "◉",
  },
}

export function ChainBadge({ chain, showIcon = true }: ChainBadgeProps) {
  const config = chainConfig[chain]

  return (
    <span
      className={cn("inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium", config.color)}
    >
      {showIcon && <span className="text-[10px]">{config.icon}</span>}
      {config.label}
    </span>
  )
}
