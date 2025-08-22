import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Empty = ({ type = "tasks", onAction, actionLabel = "Add New" }) => {
  const getEmptyContent = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "CheckSquare",
          title: "No tasks yet",
          description: "Create your first task to get started with organizing your work.",
          gradient: "from-primary to-secondary"
        }
      case "completed":
        return {
          icon: "CheckCircle2",
          title: "No completed tasks",
          description: "Tasks you complete will appear here. Keep up the great work!",
          gradient: "from-success to-green-400"
        }
      case "search":
        return {
          icon: "Search",
          title: "No results found",
          description: "Try adjusting your search terms or browse all tasks.",
          gradient: "from-info to-blue-400"
        }
      case "category":
        return {
          icon: "Folder",
          title: "No tasks in this category",
          description: "Add tasks to this category to see them here.",
          gradient: "from-accent to-orange-400"
        }
      default:
        return {
          icon: "FileText",
          title: "Nothing here yet",
          description: "Get started by adding some content.",
          gradient: "from-gray-400 to-gray-500"
        }
    }
  }

  const { icon, title, description, gradient } = getEmptyContent()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 text-center"
    >
      <div className={`w-20 h-20 bg-gradient-to-br ${gradient} rounded-full flex items-center justify-center mb-6 shadow-lg`}>
        <ApperIcon name={icon} className="w-10 h-10 text-white" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">{description}</p>
      
      {onAction && (
        <motion.button
          onClick={onAction}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="btn-primary flex items-center space-x-2 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty