'use client'

export default function TestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-4">Test Page</h1>
        <p className="text-muted-foreground mb-8">If you see this, the app is working!</p>
        <p className="text-sm text-blue-500">Visit /auth/login or /auth/sign-up to test authentication</p>
      </div>
    </div>
  )
}
