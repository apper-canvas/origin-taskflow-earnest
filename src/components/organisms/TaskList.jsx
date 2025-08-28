import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "react-toastify"
import TaskCard from "@/components/molecules/TaskCard"
import SearchBar from "@/components/molecules/SearchBar"
import TaskModal from "@/components/molecules/TaskModal"
import Button from "@/components/atoms/Button"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import Empty from "@/components/ui/Empty"
import ApperIcon from "@/components/ApperIcon"
import taskService from "@/services/api/taskService"
import categoryService from "@/services/api/categoryService"
import { useDemoCredentials } from "@/App"

const TaskList = () => {
  const { categoryId } = useParams()
  const { credentials, isEmbedded } = useDemoCredentials()
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("created")
  const [filterStatus, setFilterStatus] = useState("all")
  const [modalState, setModalState] = useState({ isOpen: false, mode: "create", task: null })

  useEffect(() => {
    loadTasks()
    loadCategories()
  }, [categoryId])

  useEffect(() => {
    filterAndSortTasks()
  }, [tasks, searchQuery, sortBy, filterStatus])

const loadTasks = async () => {
    try {
      setError("")
      setLoading(true)
      let data
      
      // Add demo user context to task loading
      if (categoryId) {
        data = await taskService.getByCategory(categoryId)
      } else {
        data = await taskService.getAll()
        data = data.filter(task => !task.archived)
      }
      
      // Filter tasks by demo user in embedded mode
      if (isEmbedded && credentials?.user?.id) {
        data = data.filter(task => 
          !task.demoUserId || task.demoUserId === credentials.user.id
        )
      }
      
      setTasks(data)
    } catch (error) {
      console.error("Failed to load tasks:", error)
      setError("Failed to load tasks")
      
      // Notify parent of error in embedded mode
      if (isEmbedded && window.parent) {
        try {
          window.parent.postMessage({
            type: 'TASKFLOW_ERROR',
            error: error.message,
            timestamp: Date.now()
          }, '*')
        } catch (postError) {
          console.warn("Failed to notify parent of error:", postError)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll()
      setCategories(data)
    } catch (error) {
      console.error("Failed to load categories:", error)
    }
  }

  const filterAndSortTasks = () => {
    let filtered = [...tasks]

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    // Sort tasks
    switch (sortBy) {
      case "title":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "priority":
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
        break
      case "dueDate":
        filtered.sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1
          return new Date(a.dueDate) - new Date(b.dueDate)
        })
        break
      default: // created
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    setFilteredTasks(filtered)
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus })
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ))
      
      if (newStatus === "completed") {
        toast.success("Task completed! 🎉")
      } else {
        toast.info("Task status updated")
      }
    } catch (error) {
      console.error("Failed to update task status:", error)
      toast.error("Failed to update task status")
    }
  }

const handleSaveTask = async (taskData) => {
    try {
      // Add demo user context to task data in embedded mode
      const enrichedTaskData = {
        ...taskData,
        ...(isEmbedded && credentials?.user?.id && {
          demoUserId: credentials.user.id,
          createdBy: credentials.user.name
        })
      }
      
      if (modalState.mode === "edit") {
        const updatedTask = await taskService.update(modalState.task.Id, enrichedTaskData)
        setTasks(prev => prev.map(task => 
          task.Id === modalState.task.Id ? updatedTask : task
        ))
        toast.success("Task updated successfully")
      } else {
        const newTask = await taskService.create(enrichedTaskData)
        setTasks(prev => [newTask, ...prev])
        toast.success("Task created successfully")
        
        // Notify parent of new task in embedded mode
        if (isEmbedded && window.parent) {
          try {
            window.parent.postMessage({
              type: 'TASKFLOW_TASK_CREATED',
              task: newTask,
              user: credentials?.user,
              timestamp: Date.now()
            }, '*')
          } catch (postError) {
            console.warn("Failed to notify parent of task creation:", postError)
          }
        }
      }
    } catch (error) {
      console.error("Failed to save task:", error)
      toast.error("Failed to save task")
      throw error
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return

    try {
      await taskService.delete(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success("Task deleted")
    } catch (error) {
      console.error("Failed to delete task:", error)
      toast.error("Failed to delete task")
    }
  }

  const handleArchiveTask = async (taskId) => {
    try {
      await taskService.archive(taskId)
      setTasks(prev => prev.filter(task => task.Id !== taskId))
      toast.success("Task archived")
    } catch (error) {
      console.error("Failed to archive task:", error)
      toast.error("Failed to archive task")
    }
  }

  const openModal = (mode, task = null) => {
    setModalState({ isOpen: true, mode, task })
  }

  const closeModal = () => {
    setModalState({ isOpen: false, mode: "create", task: null })
  }

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.Id.toString() === categoryId)
    return category?.name || "Unknown"
  }

  const getEmptyType = () => {
    if (searchQuery.trim()) return "search"
    if (filterStatus !== "all") return filterStatus
    if (categoryId) return "category"
    return "tasks"
  }

  if (loading) return <Loading type="tasks" />
  if (error) return <Error message={error} onRetry={loadTasks} type="tasks" />

  return (
    <div className="flex-1 h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              {categoryId ? getCategoryName(categoryId) : "All Tasks"}
            </h1>
            <p className="text-gray-600 mt-1">
              {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>
          <Button
            onClick={() => openModal("create")}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            <span>Add Task</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            onSearch={setSearchQuery}
            placeholder="Search tasks..."
            className="flex-1"
          />
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="created">Sort by Created</option>
              <option value="title">Sort by Title</option>
              <option value="priority">Sort by Priority</option>
              <option value="dueDate">Sort by Due Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTasks.length === 0 ? (
          <Empty
            type={getEmptyType()}
            onAction={() => openModal("create")}
            actionLabel="Add First Task"
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onEdit={(task) => openModal("edit", task)}
                  onDelete={handleDeleteTask}
                  onArchive={handleArchiveTask}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={modalState.isOpen}
        mode={modalState.mode}
        task={modalState.task}
        onSave={handleSaveTask}
        onClose={closeModal}
      />
    </div>
  )
}

export default TaskList