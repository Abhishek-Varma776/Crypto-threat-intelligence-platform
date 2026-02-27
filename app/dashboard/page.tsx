'use client'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">CACS-X Dashboard</h1>
      <p className="text-gray-400 mb-8">Cryptocurrency Risk Intelligence Platform</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">Total Wallets</h3>
          <p className="text-3xl font-bold text-blue-400">1,247</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">High Risk</h3>
          <p className="text-3xl font-bold text-red-400">89</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">Alerts Today</h3>
          <p className="text-3xl font-bold text-yellow-400">12</p>
        </div>
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
          <h3 className="text-xl font-semibold mb-2">OSINT Sources</h3>
          <p className="text-3xl font-bold text-green-400">24</p>
        </div>
      </div>
      
      <div className="bg-slate-900 p-6 rounded-lg border border-slate-800">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-400">Dashboard is working correctly. Full features will be available soon.</p>
      </div>
    </div>
  )
}
