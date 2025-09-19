import { Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'

// Pages and components
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'

function App() {
  return (
    <div>
      {/* DECORATORS */}

      {/* ROUTES */}
      <Routes>
        <Route 
          path="/" 
          element={<HomePage />} 
        />

        <Route 
          path='/login' 
          element={<LoginPage />} 
        />

        <Route 
          path="/signup" 
          element={<SignupPage />} 
        />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App