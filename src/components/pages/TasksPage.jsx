import CategorySidebar from "@/components/organisms/CategorySidebar"
import TaskList from "@/components/organisms/TaskList"

const TasksPage = () => {
  return (
    <div className="flex h-screen bg-background">
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
  )
}

export default TasksPage