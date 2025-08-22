import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { motion } from "framer-motion"
import CategoryItem from "@/components/molecules/CategoryItem"
import ApperIcon from "@/components/ApperIcon"
import Loading from "@/components/ui/Loading"
import Error from "@/components/ui/Error"
import categoryService from "@/services/api/categoryService"

const CategorySidebar = () => {
  const { categoryId } = useParams()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setError("")
      setLoading(true)
      const data = await categoryService.getAll()
      
      // Add "All Tasks" category
      const allTasksCategory = {
        Id: "all",
        name: "All Tasks",
        color: "#6B7280",
        taskCount: data.reduce((sum, cat) => sum + cat.taskCount, 0)
      }
      
      setCategories([allTasksCategory, ...data])
    } catch (error) {
      console.error("Failed to load categories:", error)
      setError("Failed to load categories")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading type="categories" />
  if (error) return <Error message={error} onRetry={loadCategories} type="categories" />

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckSquare" className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            TaskFlow
          </h1>
        </div>
      </div>

      <div className="p-4 flex-1">
        <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Categories
        </h2>
        <div className="space-y-1">
          {categories.map(category => (
            <CategoryItem
              key={category.Id}
              category={category}
              isActive={
                category.Id === "all" 
                  ? !categoryId 
                  : categoryId === category.Id.toString()
              }
            />
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-2">
            <ApperIcon name="Target" className="w-5 h-5 text-primary" />
            <span className="font-medium text-primary">Daily Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
              />
            </div>
            <span className="text-sm font-medium text-primary">65%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategorySidebar