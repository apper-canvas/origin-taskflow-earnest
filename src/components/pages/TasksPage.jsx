import { useEffect } from "react"
import CategorySidebar from "@/components/organisms/CategorySidebar"
import TaskList from "@/components/organisms/TaskList"
import { useSelector } from 'react-redux'
import { useContext } from 'react'
import { AuthContext } from '@/App'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'

const TasksPage = () => {
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { logout } = useContext(AuthContext)

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header with User Info and Logout */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <div>
              <h1 className="font-display font-bold text-lg text-gray-900">TaskFlow</h1>
            </div>
          </div>
          {isAuthenticated && user && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-600">{user.emailAddress}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <ApperIcon name="LogOut" size={16} />
                <span>Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex h-screen w-full pt-16">
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