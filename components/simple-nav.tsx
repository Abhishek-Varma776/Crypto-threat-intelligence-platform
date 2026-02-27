'use client'

import { useState } from 'react'
import { Menu, X, Shield } from 'lucide-react'

export default function SimpleNav() {
  const [isOpen, setIsOpen] = useState(false)

  const routes = [
    { path: '/landing', label: 'Landing' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/auth/login', label: 'Login' },
    { path: '/auth/sign-up', label: 'Sign Up' },
    { path: '/admin/officials', label: 'Admin' },
    { path: '/auth/sign-up-success', label: 'Success' },
  ]

  return (
    <nav className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 bg-slate-900/90 backdrop-blur-sm border border-white/10 rounded-lg text-white hover:bg-slate-800/90 transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 bg-slate-900/95 backdrop-blur-sm border border-white/10 rounded-lg p-4 min-w-[200px]">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-semibold text-white">CACS-X Navigation</span>
          </div>
          <div className="space-y-2">
            {routes.map((route) => (
              <a
                key={route.path}
                href={route.path}
                className="block px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {route.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
