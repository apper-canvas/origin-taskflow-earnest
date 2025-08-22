import { motion } from "framer-motion"
import ApperIcon from "@/components/ApperIcon"

const Error = ({ message = "Something went wrong", onRetry, type = "generic" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "tasks":
        return {
          icon: "FileX",
          title: "Failed to load tasks",
          description: "We couldn't load your tasks right now. Please try again."
        }
      case "categories":
        return {
          icon: "FolderX",
          title: "Failed to load categories",
          description: "We couldn't load your categories right now. Please try again."
        }
      default:
        return {
          icon: "AlertCircle",
          title: "Something went wrong",
          description: message
        }
    }
  }

  const { icon, title, description } = getErrorContent()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center p-8 text-center"
    >
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-error" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{description}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary flex items-center space-x-2"
        >
          <ApperIcon name="RefreshCw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </motion.div>
  )
}

export default Error