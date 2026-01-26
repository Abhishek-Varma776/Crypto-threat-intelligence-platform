"use client"

import { useState } from "react"
import { Play, Pause, RotateCcw, Database, ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DemoControlProps {
  onPlayPause?: (isPlaying: boolean) => void
  onReset?: () => void
  onLoadSnapshot?: () => void
}

export function DemoControl({ onPlayPause, onReset, onLoadSnapshot }: DemoControlProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isExpanded, setIsExpanded] = useState(true)
  const [progress, setProgress] = useState(75)

  const handlePlayPause = () => {
    const newState = !isPlaying
    setIsPlaying(newState)
    onPlayPause?.(newState)
  }

  const handleReset = () => {
    setProgress(0)
    onReset?.()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={cn(
          "rounded-xl border border-border bg-card shadow-2xl transition-all duration-200",
          isExpanded ? "w-72" : "w-auto",
        )}
      >
        {/* Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary/50 rounded-t-xl"
        >
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", isPlaying ? "bg-success animate-pulse" : "bg-warning")} />
            <span>Demo Control</span>
          </div>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="border-t border-border p-4 space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Timeline: Last 15 minutes</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent" onClick={handlePlayPause}>
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Play
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" className="bg-transparent" onClick={handleReset}>
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>

            {/* Snapshot button */}
            <Button variant="secondary" size="sm" className="w-full gap-2" onClick={onLoadSnapshot}>
              <Database className="h-4 w-4" />
              Load Offline Snapshot
            </Button>

            <p className="text-xs text-muted-foreground text-center">Use demo controls for judge presentation</p>
          </div>
        )}
      </div>
    </div>
  )
}
