import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/components/DashboardLayout'
import ProgressTracker from '@/components/ProgressTracker'
import { supabase } from '@/integrations/supabase/client'
import type { User } from '@supabase/supabase-js'

const ProgressTrackerPage = () => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUser(session.user)
      } else {
        navigate('/')
      }
    }

    checkSession()
  }, [navigate])

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Progress Tracker</h1>
          <p className="text-muted-foreground text-lg">
            Track your study progress and achievements
          </p>
        </div>
        
        <ProgressTracker user={user} />
      </div>
    </DashboardLayout>
  )
}

export default ProgressTrackerPage