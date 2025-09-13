import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { supabase } from '@/integrations/supabase/client'
import type { User } from '@supabase/supabase-js'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Check current session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        navigate('/')
      }
      setLoading(false)
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session?.user) {
          setUser(null)
          navigate('/')
        } else {
          setUser(session.user)
        }
      }
    )

    checkSession()

    return () => subscription.unsubscribe()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) return null

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-background flex items-center px-4">
            <SidebarTrigger />
            <div className="ml-4 flex-1">
              <span className="text-sm text-muted-foreground">
                Welcome, {user.user_metadata?.name || user.email}
              </span>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}