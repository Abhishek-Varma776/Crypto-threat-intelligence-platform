"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GraphNode {
  id: string
  label: string
  type: "wallet" | "pii" | "entity"
  risk?: number
}

interface GraphEdge {
  source: string
  target: string
  label?: string
}

interface NetworkGraphProps {
  nodes: GraphNode[]
  edges: GraphEdge[]
  onNodeClick?: (nodeId: string) => void
}

export function NetworkGraph({ nodes, edges, onNodeClick }: NetworkGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(new Map())

  // Initialize node positions in a force-directed layout simulation
  useEffect(() => {
    const newPositions = new Map<string, { x: number; y: number }>()
    const centerX = 200
    const centerY = 150
    const radius = 100

    nodes.forEach((node, index) => {
      const angle = (index / nodes.length) * 2 * Math.PI
      newPositions.set(node.id, {
        x: centerX + radius * Math.cos(angle) * (0.8 + Math.random() * 0.4),
        y: centerY + radius * Math.sin(angle) * (0.8 + Math.random() * 0.4),
      })
    })
    setPositions(newPositions)
  }, [nodes])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.save()
    ctx.scale(zoom, zoom)

    // Draw edges
    edges.forEach((edge) => {
      const source = positions.get(edge.source)
      const target = positions.get(edge.target)
      if (!source || !target) return

      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)
      ctx.strokeStyle = "#334155"
      ctx.lineWidth = 1
      ctx.stroke()
    })

    // Draw nodes
    nodes.forEach((node) => {
      const pos = positions.get(node.id)
      if (!pos) return

      const isHovered = hoveredNode?.id === node.id
      const nodeRadius = isHovered ? 18 : 14

      // Node circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)

      // Color based on type and risk
      if (node.type === "wallet") {
        const risk = node.risk || 0
        if (risk >= 75) ctx.fillStyle = "#EF4444"
        else if (risk >= 50) ctx.fillStyle = "#F59E0B"
        else ctx.fillStyle = "#7C3AED"
      } else if (node.type === "pii") {
        ctx.fillStyle = "#3B82F6"
      } else {
        ctx.fillStyle = "#10B981"
      }

      ctx.fill()

      // Border for hovered node
      if (isHovered) {
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // Label
      ctx.fillStyle = "#E6EEF8"
      ctx.font = "10px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(node.label.slice(0, 8) + "...", pos.x, pos.y + nodeRadius + 12)
    })

    ctx.restore()
  }, [nodes, edges, positions, zoom, hoveredNode])

  // Handle mouse interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / zoom
    const y = (e.clientY - rect.top) / zoom

    let found: GraphNode | null = null
    nodes.forEach((node) => {
      const pos = positions.get(node.id)
      if (!pos) return

      const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2)
      if (distance < 18) {
        found = node
      }
    })

    setHoveredNode(found)
    canvas.style.cursor = found ? "pointer" : "default"
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (hoveredNode && onNodeClick) {
      onNodeClick(hoveredNode.id)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-card-foreground">Network Graph</h3>
          <p className="text-xs text-muted-foreground">
            {nodes.length} nodes, {edges.length} connections
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.5))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative rounded-lg bg-background/50 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
        />

        {/* Tooltip */}
        {hoveredNode && (
          <div className="absolute top-2 left-2 rounded-lg bg-card border border-border px-3 py-2 text-xs shadow-lg">
            <p className="font-medium text-foreground">{hoveredNode.label}</p>
            <p className="text-muted-foreground capitalize">{hoveredNode.type}</p>
            {hoveredNode.risk !== undefined && <p className="text-muted-foreground">Risk: {hoveredNode.risk}</p>}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-muted-foreground">Wallet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-chart-2" />
          <span className="text-muted-foreground">PII</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-muted-foreground">Entity</span>
        </div>
      </div>
    </div>
  )
}
