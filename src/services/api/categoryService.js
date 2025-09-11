import { toast } from 'react-toastify'

class CategoryService {
  constructor() {
    this.tableName = 'category_c'
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ],
        orderBy: [{"fieldName": "Name", "sorttype": "ASC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      }
      
      const response = await this.apperClient.fetchRecords(this.tableName, params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return []
      }

      return response.data.map(category => ({
        Id: category.Id,
        name: category.name_c || category.Name,
        color: category.color_c || '#6B7280',
        taskCount: category.task_count_c || 0
      }))
    } catch (error) {
      console.error("Error fetching categories:", error?.response?.data?.message || error)
      toast.error("Failed to load categories")
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "task_count_c"}}
        ]
      }
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params)
      
      if (!response?.data) {
        return null
      }

      const category = response.data
      return {
        Id: category.Id,
        name: category.name_c || category.Name,
        color: category.color_c || '#6B7280',
        taskCount: category.task_count_c || 0
      }
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error?.response?.data?.message || error)
      return null
    }
  }

  async create(categoryData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Name: categoryData.name,
          name_c: categoryData.name,
          color_c: categoryData.color || '#6B7280',
          task_count_c: 0
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
          console.error(`Failed to create ${failed.length} categories:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const created = successful[0].data
          return {
            Id: created.Id,
            name: created.name_c || created.Name,
            color: created.color_c || '#6B7280',
            taskCount: created.task_count_c || 0
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error creating category:", error?.response?.data?.message || error)
      toast.error("Failed to create category")
      return null
    }
  }

  async update(id, categoryData) {
    try {
      if (!this.apperClient) this.initializeClient()
      
      const params = {
        records: [{
          Id: parseInt(id),
          Name: categoryData.name,
          name_c: categoryData.name,
          color_c: categoryData.color || '#6B7280',
          task_count_c: categoryData.taskCount || 0
        }]
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
          console.error(`Failed to update ${failed.length} categories:`, failed)
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`))
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successful.length > 0) {
          const updated = successful[0].data
          return {
            Id: updated.Id,
            name: updated.name_c || updated.Name,
            color: updated.color_c || '#6B7280',
            taskCount: updated.task_count_c || 0
          }
        }
      }
      return null
    } catch (error) {
      console.error("Error updating category:", error?.response?.data?.message || error)
      toast.error("Failed to update category")
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
          console.error(`Failed to delete ${failed.length} categories:`, failed)
          failed.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        return successful.length > 0
      }
      return true
    } catch (error) {
      console.error("Error deleting category:", error?.response?.data?.message || error)
      toast.error("Failed to delete category")
      return false
    }
  }
}

export default new CategoryService()