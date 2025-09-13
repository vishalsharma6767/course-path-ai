import { DashboardLayout } from '@/components/DashboardLayout'
import AIMentorChatbot from '@/components/AIMentorChatbot'

const AIMentor = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Mentor</h1>
          <p className="text-muted-foreground text-lg">
            Your personal academic and life mentor powered by AI
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <AIMentorChatbot />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default AIMentor