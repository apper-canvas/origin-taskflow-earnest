import React, { createContext, useContext, useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import TasksPage from "@/components/pages/TasksPage"

// Demo Credentials Context
const DemoCredentialsContext = createContext(null)

export const useDemoCredentials = () => {
  const context = useContext(DemoCredentialsContext)
  if (!context) {
    throw new Error("useDemoCredentials must be used within DemoCredentialsProvider")
  }
  return context
}

// Error Boundary for iframe communication errors
class IFrameErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("IFrame communication error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-8">
            <h1 className="text-2xl font-display font-bold text-gray-900 mb-4">
              Communication Error
            </h1>
            <p className="text-gray-600 mb-6">
              Failed to establish communication with parent window. Running in standalone mode.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
            >
              Reload Application
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function App({ demoCredentials = null, isEmbedded = false }) {
  const [credentials, setCredentials] = useState(demoCredentials)
  const [loading, setLoading] = useState(!demoCredentials)

  useEffect(() => {
    if (!credentials && isEmbedded) {
      // Listen for delayed credential messages
      const handleMessage = (event) => {
        if (event.data?.type === 'DEMO_CREDENTIALS' && event.data.credentials) {
          setCredentials(event.data.credentials)
          setLoading(false)
        }
      }

      window.addEventListener('message', handleMessage)
      return () => window.removeEventListener('message', handleMessage)
    }
  }, [credentials, isEmbedded])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing demo environment...</p>
        </div>
      </div>
    )
  }

  const contextValue = {
    credentials: credentials || window.__DEMO_CREDENTIALS__,
    isEmbedded: isEmbedded || window.__IS_EMBEDDED__,
    updateCredentials: setCredentials
  }

  return (
    <IFrameErrorBoundary>
      <DemoCredentialsContext.Provider value={contextValue}>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<TasksPage />} />
              <Route path="/category/:categoryId" element={<TasksPage />} />
            </Routes>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              className="toast-container"
            />
          </div>
        </BrowserRouter>
      </DemoCredentialsContext.Provider>
    </IFrameErrorBoundary>
  )
}

export default App