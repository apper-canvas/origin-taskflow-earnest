import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Input = forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-3 py-2 border rounded-lg bg-white transition-all duration-200",
        "focus:ring-2 focus:ring-primary focus:border-transparent outline-none",
        "placeholder:text-gray-400",
        error ? "border-error focus:ring-error" : "border-gray-300",
        className
      )}
      {...props}
    />
  )
})

Input.displayName = "Input"

export default Input