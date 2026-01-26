"use client"

import { useState, useEffect } from "react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

interface RiskDistributionProps {
  isLive?: boolean
  totalWallets?: number
}

const initialData = [
  { name: "Critical (80-100)", value: 156, color: "#EF4444" },
  { name: "High (60-79)", value: 324, color: "#F59E0B" },
  { name: "Medium (40-59)", value: 512, color: "#3B82F6" },
  { name: "Low (20-39)", value: 892, color: "#10B981" },
  { name: "Safe (0-19)", value: 2145, color: "#16A34A" },
]

export function RiskDistribution({ isLive = false, totalWallets }: RiskDistributionProps) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((item, index) => ({
          ...item,
          value: item.value + Math.floor(Math.random() * (5 - index)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-card-foreground">Risk Distribution</h3>
        <p className="text-sm text-muted-foreground">
          Wallet categorization breakdown
          {isLive && (
            <span className="ml-2 inline-flex items-center gap-1 text-success">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Live
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="h-48 w-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0B1220",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#E6EEF8",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
