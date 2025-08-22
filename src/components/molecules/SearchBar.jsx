import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Input from "@/components/atoms/Input"
import ApperIcon from "@/components/ApperIcon"

const SearchBar = ({ onSearch, placeholder = "Search tasks...", className = "" }) => {
  const [query, setQuery] = useState("")

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [query, onSearch])

  const handleClear = () => {
    setQuery("")
    onSearch("")
  }

  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
      />
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-10"
      />
      {query && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" className="w-4 h-4" />
        </motion.button>
      )}
    </div>
  )
}

export default SearchBar