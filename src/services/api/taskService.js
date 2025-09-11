import { toast } from 'react-toastify'

class TaskService {
  constructor() {
    this.tableName = 'task_c'
    this.apperClient = null
    this.initializeClient()
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      })
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "demo_user_id_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(task => this.formatTaskFromDB(task))
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error)
      toast.error("Failed to load tasks")
      return []
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "demo_user_id_c"}},
          {"field": {"Name": "created_by_c"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      return this.formatTaskFromDB(response.data)
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async getByCategory(categoryId) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "demo_user_id_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        where: [
          {"FieldName": "category_id_c", "Operator": "EqualTo", "Values": [parseInt(categoryId)]},
          {"FieldName": "archived_c", "Operator": "EqualTo", "Values": [false]}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(task => this.formatTaskFromDB(task))
    } catch (error) {
      console.error("Error fetching tasks by category:", error?.response?.data?.message || error)
      return []
    }
  }

  async getByStatus(status) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "demo_user_id_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]},
          {"FieldName": "archived_c", "Operator": "EqualTo", "Values": [false]}
        ],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(task => this.formatTaskFromDB(task))
    } catch (error) {
      console.error("Error fetching tasks by status:", error?.response?.data?.message || error)
      return []
    }
  }

  async create(taskData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Name: taskData.title,
          title_c: taskData.title,
          description_c: taskData.description || "",
          category_id_c: parseInt(taskData.categoryId),
          priority_c: taskData.priority,
          status_c: taskData.status,
          due_date_c: taskData.dueDate || null,
          created_at_c: new Date().toISOString(),
          completed_at_c: null,
          archived_c: false,
          demo_user_id_c: taskData.demoUserId || "",
          created_by_c: taskData.createdBy || ""
        }]
      }
      
      const response = await this.apperClient.createRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return this.formatTaskFromDB(successful[0].data)
        }
      }
      return null
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error)
      toast.error("Failed to create task")
      return null
    }
  }

  async update(id, taskData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const updateData = {
        Id: parseInt(id),
        Name: taskData.title,
        title_c: taskData.title,
        description_c: taskData.description || "",
        category_id_c: parseInt(taskData.categoryId),
        priority_c: taskData.priority,
        status_c: taskData.status,
        due_date_c: taskData.dueDate || null,
        archived_c: taskData.archived !== undefined ? taskData.archived : false,
        demo_user_id_c: taskData.demoUserId || "",
        created_by_c: taskData.createdBy || ""
      }
      
      // Set completedAt when status changes to completed
      if (taskData.status === "completed") {
        updateData.completed_at_c = new Date().toISOString()
      }
      
      // Clear completedAt when status changes from completed
      if (taskData.status !== "completed") {
        updateData.completed_at_c = null
      }
      
      const params = {
        records: [updateData]
      }
      
      const response = await this.apperClient.updateRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return null
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          return this.formatTaskFromDB(successful[0].data)
        }
      }
      return null
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error)
      toast.error("Failed to update task")
      return null
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = { 
        RecordIds: [parseInt(id)]
      }
      
      const response = await this.apperClient.deleteRecord(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success)
        const failed = response.results.filter(r => !r.success)
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} tasks:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        return successful.length > 0
      }
      return true
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error)
      toast.error("Failed to delete task")
      return false
    }
  }

  async archive(id) {
    try {
      const taskData = { archived: true }
      return await this.update(id, taskData)
    } catch (error) {
      console.error("Error archiving task:", error?.response?.data?.message || error)
      toast.error("Failed to archive task")
      return null
    }
  }

  async restore(id) {
    try {
      const taskData = { archived: false }
      return await this.update(id, taskData)
    } catch (error) {
      console.error("Error restoring task:", error?.response?.data?.message || error)
      toast.error("Failed to restore task")
      return null
    }
  }

  async search(query) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "archived_c"}},
          {"field": {"Name": "demo_user_id_c"}},
          {"field": {"Name": "created_by_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "archived_c", "operator": "EqualTo", "values": [false]}
              ],
              "operator": ""
            },
            {
              "conditions": [
                {"fieldName": "title_c", "operator": "Contains", "values": [query]},
                {"fieldName": "description_c", "operator": "Contains", "values": [query]}
              ],
              "operator": "OR"
            }
          ]
        }],
        orderBy: [{"fieldName": "created_at_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 200, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        return []
      }

      return response.data.map(task => this.formatTaskFromDB(task))
    } catch (error) {
      console.error("Error searching tasks:", error?.response?.data?.message || error)
      return []
    }
  }

  formatTaskFromDB(task) {
    return {
      Id: task.Id,
      title: task.title_c || task.Name,
      description: task.description_c || "",
      categoryId: task.category_id_c?.Id?.toString() || task.category_id_c?.toString() || "1",
      priority: task.priority_c || "medium",
      status: task.status_c || "pending",
      dueDate: task.due_date_c || null,
      createdAt: task.created_at_c || new Date().toISOString(),
      completedAt: task.completed_at_c || null,
      archived: task.archived_c || false,
      demoUserId: task.demo_user_id_c || "",
      createdBy: task.created_by_c || ""
    }
  }
}

export default new TaskService()