import categoriesData from "@/services/mockData/categories.json"
import taskService from "@/services/api/taskService"

class CategoryService {
  constructor() {
    this.categories = [...categoriesData]
  }

  async getAll() {
    await this.delay(250)
    // Update task counts dynamically
    const tasks = await taskService.getAll()
    return this.categories.map(category => ({
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.Id.toString() && !task.archived).length
    }))
  }

  async getById(id) {
    await this.delay(200)
    const category = this.categories.find(category => category.Id === parseInt(id))
    if (!category) return null
    
    // Update task count
    const tasks = await taskService.getAll()
    return {
      ...category,
      taskCount: tasks.filter(task => task.categoryId === category.Id.toString() && !task.archived).length
    }
  }

  async create(categoryData) {
    await this.delay(300)
    const newCategory = {
      Id: this.getNextId(),
      ...categoryData,
      taskCount: 0
    }
    this.categories.push(newCategory)
    return { ...newCategory }
  }

  async update(id, categoryData) {
    await this.delay(250)
    const index = this.categories.findIndex(category => category.Id === parseInt(id))
    if (index === -1) throw new Error("Category not found")
    
    this.categories[index] = { ...this.categories[index], ...categoryData }
    return { ...this.categories[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.categories.findIndex(category => category.Id === parseInt(id))
    if (index === -1) throw new Error("Category not found")
    
    const deletedCategory = this.categories.splice(index, 1)[0]
    return { ...deletedCategory }
  }

  getNextId() {
    return Math.max(...this.categories.map(category => category.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new CategoryService()