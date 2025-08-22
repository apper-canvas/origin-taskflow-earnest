import tasksData from "@/services/mockData/tasks.json"

class TaskService {
  constructor() {
    this.tasks = [...tasksData]
  }

  async getAll() {
    await this.delay(300)
    return [...this.tasks]
  }

  async getById(id) {
    await this.delay(200)
    const task = this.tasks.find(task => task.Id === parseInt(id))
    return task ? { ...task } : null
  }

  async getByCategory(categoryId) {
    await this.delay(250)
    return this.tasks.filter(task => task.categoryId === categoryId && !task.archived)
  }

  async getByStatus(status) {
    await this.delay(250)
    return this.tasks.filter(task => task.status === status && !task.archived)
  }

  async create(taskData) {
    await this.delay(300)
    const newTask = {
      Id: this.getNextId(),
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: null,
      archived: false
    }
    this.tasks.push(newTask)
    return { ...newTask }
  }

  async update(id, taskData) {
    await this.delay(250)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    this.tasks[index] = { ...this.tasks[index], ...taskData }
    
    // Set completedAt when status changes to completed
    if (taskData.status === "completed" && this.tasks[index].completedAt === null) {
      this.tasks[index].completedAt = new Date().toISOString()
    }
    
    // Clear completedAt when status changes from completed
    if (taskData.status !== "completed" && this.tasks[index].completedAt !== null) {
      this.tasks[index].completedAt = null
    }
    
    return { ...this.tasks[index] }
  }

  async delete(id) {
    await this.delay(200)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    const deletedTask = this.tasks.splice(index, 1)[0]
    return { ...deletedTask }
  }

  async archive(id) {
    await this.delay(200)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    this.tasks[index].archived = true
    return { ...this.tasks[index] }
  }

  async restore(id) {
    await this.delay(200)
    const index = this.tasks.findIndex(task => task.Id === parseInt(id))
    if (index === -1) throw new Error("Task not found")
    
    this.tasks[index].archived = false
    return { ...this.tasks[index] }
  }

  async search(query) {
    await this.delay(300)
    const lowercaseQuery = query.toLowerCase()
    return this.tasks.filter(task => 
      !task.archived && (
        task.title.toLowerCase().includes(lowercaseQuery) ||
        task.description.toLowerCase().includes(lowercaseQuery)
      )
    )
  }

  getNextId() {
    return Math.max(...this.tasks.map(task => task.Id), 0) + 1
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

export default new TaskService()