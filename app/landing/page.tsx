'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Shield, Brain, Network, Search, BarChart3, GitBranch, Zap, Lock, Database, TrendingUp, Activity } from 'lucide-react'
import SimpleNav from '@/components/simple-nav'

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const nodes: Array<{x: number, y: number, vx: number, vy: number, radius: number}> = []
    const connections: Array<{from: number, to: number, opacity: number}> = []

    // Create nodes
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach(node => {
        node.x += node.vx
        node.y += node.vy

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1
      })

      // Draw connections
      nodes.forEach((node1, i) => {
        nodes.forEach((node2, j) => {
          if (i < j) {
            const distance = Math.sqrt((node1.x - node2.x) ** 2 + (node1.y - node2.y) ** 2)
            if (distance < 150) {
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 150)})`
              ctx.lineWidth = 0.5
              ctx.beginPath()
              ctx.moveTo(node1.x, node1.y)
              ctx.lineTo(node2.x, node2.y)
              ctx.stroke()
            }
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.8)'
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <SimpleNav />
      
      {/* Animated Background */}
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.6 }}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-6xl mx-auto text-center z-10">
          <div className="mb-6">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
              <Shield className="w-4 h-4 mr-2" />
              CACS-X Enterprise
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            AI-Powered Crypto Risk<br />Intelligence Engine
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transforming unstructured crypto data into structured, risk-scored, and network-linked intelligence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.location.href = '/auth/login'}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              Login
              <ArrowRight className="w-5 h-5" />
            </button>
            
            <button 
              onClick={() => window.location.href = '/auth/sign-up'}
              className="px-8 py-4 bg-white/10 hover:bg-white/15 backdrop-blur-sm border border-white/20 rounded-lg font-semibold text-white transition-all duration-300 hover:scale-105"
            >
              Sign Up
            </button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">The Hidden Risk in Cryptocurrency</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              The decentralized nature of cryptocurrency creates unprecedented challenges for risk management and compliance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Lock,
                title: "Crypto Anonymity",
                description: "Pseudonymous transactions obscure real-world identities, making due diligence nearly impossible."
              },
              {
                icon: Database,
                title: "Scattered Intelligence",
                description: "Risk data exists across siloed databases, blockchain explorers, and dark web forums."
              },
              {
                icon: Search,
                title: "Manual Investigation",
                description: "Traditional methods can't scale to analyze millions of transactions across multiple chains."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                style={{ transform: `translateY(${scrollY * 0.05 * (index + 1)}px)` }}
              >
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-transparent to-blue-950/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Meet CACS-X</h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our AI-powered platform transforms cryptocurrency risk assessment from manual investigation to automated intelligence.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: "Autonomous OSINT Collection",
                description: "Continuous gathering of threat intelligence from dark web, social media, and blockchain data sources."
              },
              {
                icon: BarChart3,
                title: "AI-Based Risk Classification",
                description: "Machine learning models analyze patterns to assign risk scores with 95%+ accuracy."
              },
              {
                icon: GitBranch,
                title: "Wallet Correlation & Clustering",
                description: "Graph algorithms identify related wallets and uncover hidden transaction networks."
              },
              {
                icon: Network,
                title: "Graph-Based Network Intelligence",
                description: "Visualize relationships between entities, transactions, and risk indicators in real-time."
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl hover:from-white/10 hover:to-white/5 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/10"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-blue-950/20 to-purple-950/30">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium backdrop-blur-sm">
              <Zap className="w-4 h-4 mr-2" />
              Ready to Transform Your Crypto Intelligence?
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
            Turn Crypto Chaos Into Intelligence
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join the next generation of cryptocurrency risk management. Experience the power of AI-driven intelligence today.
          </p>
          
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-semibold text-white text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-600/25 flex items-center justify-center gap-3 mx-auto"
          >
            Get Started
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CACS-X</span>
              </div>
              <p className="text-gray-500 text-sm">Cryptocurrency Addressing and Categorized System</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm mb-1">Hackathon Project 2026</p>
              <p className="text-gray-600 text-xs">Built with AI & Graph Analytics • Team CipherTech</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
