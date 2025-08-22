import { motion } from "framer-motion"
import { useNavigate, useLocation } from "react-router-dom"
import ApperIcon from "@/components/ApperIcon"

const CategoryItem = ({ category, isActive = false }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    if (category.Id === "all") {
      navigate("/")
    } else {
      navigate(`/category/${category.Id}`)
    }
  }

  return (
    <motion.button
      whileHover={{ x: 2 }}
      onClick={handleClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 ${
        isActive 
          ? "bg-primary/10 text-primary border-l-4 border-primary" 
          : "hover:bg-gray-50 text-gray-700"
      }`}
    >
      <div className="flex items-center space-x-3">
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="font-medium">{category.name}</span>
      </div>
      <span className={`text-sm px-2 py-0.5 rounded-full ${
        isActive ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-600"
      }`}>
        {category.taskCount || 0}
      </span>
    </motion.button>
  )
}

export default CategoryItem