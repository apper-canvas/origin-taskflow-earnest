import React from "react"
import { motion } from "framer-motion"
import { format, isToday, isPast, parseISO } from "date-fns"
import ApperIcon from "@/components/ApperIcon"
import Badge from "@/components/atoms/Badge"
import Button from "@/components/atoms/Button"
import { useDemoCredentials } from "@/App"

const TaskCard = React.forwardRef(({ task, onStatusChange, onEdit, onDelete, onArchive }, ref) => {
  const { credentials, isEmbedded } = useDemoCredentials()
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-error"
      case "medium": return "bg-warning"
      case "low": return "bg-success"
      default: return "bg-gray-400"
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge variant="success">Completed</Badge>
      case "in-progress":
        return <Badge variant="primary">In Progress</Badge>
      case "pending":
        return <Badge variant="default">Pending</Badge>
      default:
        return <Badge variant="default">Unknown</Badge>
    }
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = parseISO(dateString)
    if (isToday(date)) return "Today"
    return format(date, "MMM d")
  }

  const isDueDatePast = (dateString) => {
    if (!dateString) return false
    return isPast(parseISO(dateString)) && !isToday(parseISO(dateString))
  }

  const handleStatusToggle = () => {
    let newStatus = "completed"
    if (task.status === "completed") {
      newStatus = "pending"
    } else if (task.status === "pending") {
      newStatus = "in-progress"
    }
    onStatusChange(task.Id, newStatus)
  }

return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="task-card group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleStatusToggle}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
              task.status === "completed" 
                ? "bg-success border-success" 
                : "border-gray-300 hover:border-primary"
            }`}
          >
            {task.status === "completed" && (
              <ApperIcon name="Check" className="w-3 h-3 text-white" />
            )}
          </motion.button>
<div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className={`font-medium text-gray-900 ${
                task.status === "completed" ? "line-through text-gray-500" : ""
              }`}>
                {task.title}
              </h3>
              {isEmbedded && task.createdBy && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {task.createdBy}
                </span>
              )}
            </div>
            {task.description && (
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
            )}
<div className="flex items-center space-x-3">
              {getStatusBadge(task.status)}
              {task.dueDate && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  isDueDatePast(task.dueDate) 
                    ? "bg-error/10 text-error" 
                    : isToday(parseISO(task.dueDate))
                    ? "bg-warning/10 text-warning"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  <ApperIcon name="Calendar" className="w-3 h-3 inline mr-1" />
                  {formatDueDate(task.dueDate)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className={`priority-dot ${getPriorityColor(task.priority)}`} />
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
              className="p-1.5"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onArchive(task.Id)}
              className="p-1.5"
            >
              <ApperIcon name="Archive" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.Id)}
              className="p-1.5 text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
</motion.div>
)
})

TaskCard.displayName = "TaskCard"

TaskCard.displayName = "TaskCard"

export default TaskCard