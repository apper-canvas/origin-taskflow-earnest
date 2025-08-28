import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import "./index.css"

// Demo credentials fallback
const DEMO_CREDENTIALS = {
  user: {
    id: "demo-user-1",
    name: "Demo User",
    email: "demo@taskflow.app",
    role: "user"
  },
  preferences: {
    theme: "light",
    notifications: true
  }
}

// Initialize demo credentials and iframe communication
const initializeApp = async () => {
  let demoCredentials = null
  let isEmbedded = false

  try {
    // Check if running in iframe
    isEmbedded = window !== window.parent

    if (isEmbedded) {
      // Try to get credentials from parent
      demoCredentials = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Failed to get demo user credentials from parent"))
        }, 3000)

        const handleMessage = (event) => {
          if (event.data?.type === 'DEMO_CREDENTIALS') {
            clearTimeout(timeout)
            window.removeEventListener('message', handleMessage)
            resolve(event.data.credentials)
          }
        }

        window.addEventListener('message', handleMessage)
        
        // Request credentials from parent
        window.parent.postMessage({ 
          type: 'REQUEST_DEMO_CREDENTIALS',
          timestamp: Date.now()
        }, '*')
      })
    } else {
      // Use fallback credentials for standalone mode
      demoCredentials = DEMO_CREDENTIALS
    }
  } catch (error) {
    console.warn("Parent communication failed, using fallback credentials:", error.message)
    demoCredentials = DEMO_CREDENTIALS
  }

  // Store credentials globally
  window.__DEMO_CREDENTIALS__ = demoCredentials
  window.__IS_EMBEDDED__ = isEmbedded

  // Render app
  ReactDOM.createRoot(document.getElementById("root")).render(
    <App demoCredentials={demoCredentials} isEmbedded={isEmbedded} />
  )
}

// Initialize the application
initializeApp().catch(error => {
  console.error("Failed to initialize app:", error)
  // Fallback render with default credentials
  window.__DEMO_CREDENTIALS__ = DEMO_CREDENTIALS
  window.__IS_EMBEDDED__ = false
  ReactDOM.createRoot(document.getElementById("root")).render(
    <App demoCredentials={DEMO_CREDENTIALS} isEmbedded={false} />
  )
})