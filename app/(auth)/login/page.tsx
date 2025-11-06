'use client'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Redirect to homepage with login modal
    const params = new URLSearchParams(searchParams)
    params.set('modal', 'login')
    router.replace(`/?${params.toString()}`)
  }, [router, searchParams])
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to login...</p>
    </div>
  )
}