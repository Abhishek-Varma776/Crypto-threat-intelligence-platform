'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock } from 'lucide-react'

interface Official {
  id: string
  email: string
  full_name: string
  department: string
  is_verified: boolean
  created_at: string
}

export default function AdminOfficialsPage() {
  const [officials, setOfficials] = useState<Official[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    const fetchOfficials = async () => {
      try {
        const { data, error } = await supabase
          .from('government_officials')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setOfficials(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch officials')
      } finally {
        setLoading(false)
      }
    }

    fetchOfficials()
  }, [])

  const handleVerify = async (id: string) => {
    try {
      const { error } = await supabase
        .from('government_officials')
        .update({ is_verified: true })
        .eq('id', id)

      if (error) throw error

      setOfficials(officials.map(o => 
        o.id === id ? { ...o, is_verified: true } : o
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify official')
    }
  }

  const handleDeny = async (id: string) => {
    try {
      const { error } = await supabase
        .from('government_officials')
        .delete()
        .eq('id', id)

      if (error) throw error

      setOfficials(officials.filter(o => o.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove official')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading officials...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">Official Verification</h1>
        <p className="text-muted-foreground mt-2">Manage and approve government officials</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Pending & Verified Officials ({officials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {officials.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">No officials registered yet</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {officials.map((official) => (
                    <TableRow key={official.id}>
                      <TableCell className="font-mono text-sm">{official.email}</TableCell>
                      <TableCell>{official.full_name || '-'}</TableCell>
                      <TableCell>{official.department || '-'}</TableCell>
                      <TableCell>
                        {official.is_verified ? (
                          <Badge className="bg-green-500/20 text-green-500 border-green-500/30">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(official.created_at)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {!official.is_verified && (
                          <>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleVerify(official.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeny(official.id)}
                            >
                              Deny
                            </Button>
                          </>
                        )}
                        {official.is_verified && (
                          <span className="text-xs text-muted-foreground">Verified</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-blue-500 text-sm">
          <strong>Note:</strong> This is a basic admin panel. In production, this should be protected with additional authorization checks (e.g., role-based access).
        </p>
      </div>
    </div>
  )
}
