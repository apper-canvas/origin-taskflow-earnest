import { useEffect } from "react"
import CategorySidebar from "@/components/organisms/CategorySidebar"
import TaskList from "@/components/organisms/TaskList"
import { useDemoCredentials } from "@/App"

const TasksPage = () => {
  const { credentials, isEmbedded } = useDemoCredentials()

  useEffect(() => {
    // Notify parent window when page is loaded (for embedded mode)
    if (isEmbedded && window.parent) {
      try {
        window.parent.postMessage({
          type: 'TASKFLOW_READY',
          user: credentials?.user,
          timestamp: Date.now()
        }, '*')
      } catch (error) {
        console.warn("Failed to notify parent of ready state:", error)
      }
    }
  }, [isEmbedded, credentials])

  return (
    <div className="flex h-screen bg-background">
      {/* Demo User Info Bar (only in embedded mode) */}
      {isEmbedded && credentials?.user && (
        <div className="absolute top-0 left-0 right-0 bg-primary/10 border-b border-primary/20 px-4 py-2 z-10">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">
              Demo Mode: {credentials.user.name} ({credentials.user.email})
            </span>
            <span className="text-primary/70">
              Embedded in parent application
            </span>
          </div>
        </div>
      )}

      <div className={`flex h-screen w-full ${isEmbedded ? 'pt-10' : ''}`}>
        {/* Desktop Sidebar - Static */}
        <div className="hidden lg:block">
          <CategorySidebar />
        </div>

        {/* Mobile Sidebar - Overlay (would be implemented with mobile menu toggle) */}
        <div className="lg:hidden">
          {/* Mobile navigation would be implemented here with overlay pattern */}
        </div>

        {/* Main Content */}
        <TaskList />
      </div>
    </div>
  )
}

export default TasksPage