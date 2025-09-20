import { Navigate, Route, Routes } from 'react-router'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore.js'

// Pages and components
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import Navbar from './components/Navbar.jsx'
import PageLoader from './components/PageLoader.jsx'

function App() {

  const { user, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({user})

  if (isCheckingAuth) return <PageLoader />;

  return (
    <div>
      {/* DECORATORS */}

      {/* NAVBAR */}
      <Navbar />
      {/* ROUTES */}
      <Routes>
        <Route 
          path="/" 
          element={user ? <HomePage /> : <Navigate to="/login" />} 
        />

        <Route 
          path='/login' 
          element={!user ? <LoginPage /> : <Navigate to="/" />} 
        />

        <Route 
          path="/signup" 
          element={!user ? <SignupPage /> : <Navigate to="/" />} 
        />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App