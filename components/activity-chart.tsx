"use client"

import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface ActivityChartProps {
  isLive?: boolean
}

const initialData = [
  { time: "00:00", wallets: 120, alerts: 5 },
  { time: "04:00", wallets: 89, alerts: 3 },
  { time: "08:00", wallets: 156, alerts: 8 },
  { time: "12:00", wallets: 234, alerts: 12 },
  { time: "16:00", wallets: 312, alerts: 15 },
  { time: "20:00", wallets: 278, alerts: 9 },
  { time: "Now", wallets: 345, alerts: 11 },
]

export function ActivityChart({ isLive = false }: ActivityChartProps) {
  const [data, setData] = useState(initialData)

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev]
        const lastIndex = newData.length - 1
        newData[lastIndex] = {
          ...newData[lastIndex],
          wallets: newData[lastIndex].wallets + Math.floor(Math.random() * 20) + 5,
          alerts: newData[lastIndex].alerts + (Math.random() > 0.7 ? 1 : 0),
        }
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isLive])

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-card-foreground">Activity Overview</h3>
          <p className="text-sm text-muted-foreground">
            Last 24 hours
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
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Wallets Scanned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Alerts</span>
          </div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="walletGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF4444" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "#9AA6B2", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#9AA6B2", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0B1220",
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#E6EEF8",
              }}
            />
            <Area type="monotone" dataKey="wallets" stroke="#7C3AED" strokeWidth={2} fill="url(#walletGradient)" />
            <Area type="monotone" dataKey="alerts" stroke="#EF4444" strokeWidth={2} fill="url(#alertGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
