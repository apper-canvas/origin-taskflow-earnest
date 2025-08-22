import { motion } from "framer-motion"

const Loading = ({ type = "tasks" }) => {
  const renderTasksLoading = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-surface rounded-lg p-4 shadow-card"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-0.5"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-full"></div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-16 h-6 bg-gray-100 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderCategoriesLoading = () => (
    <div className="space-y-2">
      {[...Array(5)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center justify-between p-3 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="w-6 h-4 bg-gray-100 rounded animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  )

  const renderGenericLoading = () => (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-secondary border-t-primary rounded-full"
        />
      </div>
    </div>
  )

  switch (type) {
    case "tasks":
      return renderTasksLoading()
    case "categories":
      return renderCategoriesLoading()
    default:
      return renderGenericLoading()
  }
}

export default Loading