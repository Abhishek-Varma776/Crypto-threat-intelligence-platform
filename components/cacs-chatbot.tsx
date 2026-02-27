'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Shield, AlertTriangle, TrendingUp, Network, Brain, Search } from 'lucide-react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  typing?: boolean
  walletAnalysis?: WalletAnalysis
}

interface WalletAnalysis {
  address: string
  riskScore: number
  riskCategory: 'Low' | 'Medium' | 'High' | 'Critical'
  relatedWallets: number
  explanation: string
  riskFactors: string[]
}

export default function CACSChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🛡️ Welcome to CACS-X Intelligence Assistant. I can analyze cryptocurrency wallets and explain our risk intelligence capabilities. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getRiskColor = (score: number) => {
    if (score < 30) return 'bg-green-500'
    if (score < 70) return 'bg-yellow-500'
    if (score < 90) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getRiskTextColor = (score: number) => {
    if (score < 30) return 'text-green-400'
    if (score < 70) return 'text-yellow-400'
    if (score < 90) return 'text-orange-400'
    return 'text-red-400'
  }

  const simulateWalletAnalysis = (address: string): WalletAnalysis => {
    const hash = address.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const riskScore = (hash % 100)
    
    const categories: Array<'Low' | 'Medium' | 'High' | 'Critical'> = ['Low', 'Medium', 'High', 'Critical']
    const riskCategory = categories[Math.floor(riskScore / 25)]
    
    const explanations = {
      Low: 'This wallet shows normal transaction patterns with minimal risk indicators.',
      Medium: 'This wallet has some concerning associations that warrant monitoring.',
      High: 'This wallet demonstrates significant risk factors and connections to suspicious activity.',
      Critical: 'This wallet exhibits critical risk patterns with strong ties to illicit activities.'
    }
    
    const riskFactors = {
      Low: ['Low transaction volume', 'No mixer interactions', 'Clean blockchain history'],
      Medium: ['Moderate transaction frequency', 'Some high-risk counterparties', 'Unusual timing patterns'],
      High: ['Frequent mixer usage', 'Connections to known bad actors', 'Rapid fund movement'],
      Critical: ['Direct ransomware links', 'Extensive mixer network', 'Money laundering patterns']
    }
    
    return {
      address,
      riskScore,
      riskCategory,
      relatedWallets: Math.floor(hash % 50) + 1,
      explanation: explanations[riskCategory],
      riskFactors: riskFactors[riskCategory]
    }
  }

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Wallet address detection
    if (/^(0x)?[a-f0-9]{40}$/i.test(input) || /^[1-9A-HJ-NP-Za-km-z]{26,35}$/.test(input) || /^bc1[a-z0-9]{39,59}$/i.test(input)) {
      return `Analyzing wallet address: ${input}...`
    }
    
    // System feature questions
    if (input.includes('risk scoring') || input.includes('how does risk')) {
      return "CACS-X uses advanced ML algorithms to analyze transaction patterns, network connections, and historical behavior. Our system evaluates over 50 risk indicators including mixer usage, transaction velocity, and associations with known malicious entities to generate a comprehensive risk score from 0-100."
    }
    
    if (input.includes('clustering') || input.includes('wallet clustering')) {
      return "Our clustering algorithms identify related wallets through graph analysis, common ownership patterns, and transaction flow analysis. We can map entire criminal networks by tracing fund movements across multiple blockchains, revealing hidden connections between seemingly unrelated addresses."
    }
    
    if (input.includes('graph visualization') || input.includes('network graph')) {
      return "CACS-X provides interactive graph visualization showing wallet relationships, transaction flows, and risk propagation. Our visual interface helps investigators understand complex money laundering schemes and identify key nodes in criminal networks through intuitive network mapping."
    }
    
    if (input.includes('source reliability') || input.includes('data sources')) {
      return "We aggregate intelligence from 24+ OSINT sources including dark web markets, blockchain explorers, sanction lists, and threat intelligence feeds. Each source is weighted for reliability and cross-referenced to ensure accurate, actionable intelligence for cryptocurrency investigations."
    }
    
    // Default responses
    const defaultResponses = [
      "I can help you analyze cryptocurrency wallets and explain CACS-X capabilities. Try asking me to analyze a wallet address or explain our features.",
      "CACS-X provides comprehensive cryptocurrency risk intelligence. What specific aspect would you like to know more about?",
      "I'm here to assist with wallet analysis and system information. What would you like to explore?"
    ]
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
  }

  const sendMessage = async () => {
    if (!inputValue.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)
    
    // Simulate typing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Check if it's a wallet address
    const isWalletAddress = /^(0x)?[a-f0-9]{40}$/i.test(inputValue) || 
                           /^[1-9A-HJ-NP-Za-km-z]{26,35}$/.test(inputValue) || 
                           /^bc1[a-z0-9]{39,59}$/i.test(inputValue)
    
    let botResponse: Message
    
    if (isWalletAddress) {
      const analysis = simulateWalletAnalysis(inputValue)
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: `🔍 Wallet Analysis Complete`,
        sender: 'bot',
        timestamp: new Date(),
        walletAnalysis: analysis
      }
    } else {
      botResponse = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      }
    }
    
    setMessages(prev => [...prev, botResponse])
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const examplePrompts = [
    "Analyze this wallet: 0x742d35Cc6634C0532925a3b8D4C9db96c4b4d8b",
    "Why is this wallet high risk?",
    "How does clustering work?",
    "Show related addresses",
    "Explain risk scoring"
  ]

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating AI Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-pulse"></div>
          <MessageCircle className="w-6 h-6 text-white relative z-10" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[600px] bg-slate-900/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 pointer-events-none"></div>
          <div className="absolute inset-0 rounded-2xl border border-blue-400/20 shadow-[0_0_20px_rgba(59,130,246,0.3)] pointer-events-none"></div>
          
          {/* Header */}
          <div className="relative bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border-b border-blue-500/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">CACS-X Intelligence</h3>
                  <p className="text-blue-300 text-xs">AI Assistant • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] ${
                    message.sender === 'user'
                      ? 'bg-blue-600/20 border border-blue-500/30 text-white'
                      : 'bg-slate-800/50 border border-slate-700/50 text-gray-200'
                  } rounded-2xl px-4 py-3 backdrop-blur-sm`}
                >
                  {message.walletAnalysis ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-400" />
                        <span className="font-semibold text-white">Wallet Analysis</span>
                      </div>
                      
                      <div className="text-xs font-mono text-blue-300 break-all">
                        {message.walletAnalysis.address}
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400">Risk Score:</span>
                          <span className={`font-bold ${getRiskTextColor(message.walletAnalysis.riskScore)}`}>
                            {message.walletAnalysis.riskScore}/100
                          </span>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getRiskColor(message.walletAnalysis.riskScore)} bg-opacity-20 text-white`}>
                          {message.walletAnalysis.riskCategory}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Network className="w-4 h-4 text-blue-400" />
                          <span className="text-gray-400">Related Wallets:</span>
                          <span className="text-white font-semibold">{message.walletAnalysis.relatedWallets}</span>
                        </div>
                        
                        <div className="text-sm text-gray-300">
                          {message.walletAnalysis.explanation}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-gray-400 font-semibold">Risk Factors:</div>
                          {message.walletAnalysis.riskFactors.map((factor, index) => (
                            <div key={index} className="flex items-center gap-2 text-xs">
                              <AlertTriangle className="w-3 h-3 text-yellow-400" />
                              <span className="text-gray-300">{factor}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  )}
                  <div className="text-xs text-gray-500 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Example Prompts */}
          <div className="px-4 py-2 border-t border-slate-700/50">
            <div className="flex flex-wrap gap-2">
              {examplePrompts.slice(0, 2).map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInputValue(prompt)}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors truncate max-w-[140px]"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative p-4 border-t border-slate-700/50">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about wallets or system features..."
                className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
