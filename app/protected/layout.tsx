import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is a verified government official
  const { data: profile } = await supabase
    .from('government_officials')
    .select('is_verified')
    .eq('id', user.id)
    .single()

  if (!profile?.is_verified) {
    redirect('/auth/error?error=Unverified')
  }

  return <>{children}</>
}
