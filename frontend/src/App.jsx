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
import BookService from './pages/BookService.jsx'
import WorkerDashboard from './components/WorkerDashboard.jsx'
import PaymentsPage from './pages/PaymentsPage.jsx'
import ChatsPage from './pages/ChatsPage.jsx'
import WorkerDetails from './components/WorkerDetails.jsx'
import RegisterAsWorker from './pages/RegisterAsWorker.jsx'
import PaymentVerify from './pages/PaymentVerify.jsx'
import ViewApplicationStatus from './pages/ViewApplicationStatus.jsx'

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

        <Route 
          path='/book-service'
          element={user ? <BookService /> : <Navigate to="/login" />}
        />

        <Route 
          path='/workers'
          element={user ? <BookService /> : <Navigate to="/login" />}
        />

        <Route 
          path='/payment-methods'
          element={user ? <PaymentsPage /> : <Navigate to="/login" />}
        />

        <Route 
          path='/register'
          element={user ? <RegisterAsWorker /> : <Navigate to="/login" />}
        />

        <Route 
          path='/messages'
          element={user ? <ChatsPage /> : <Navigate to="/login" />}
        />

        <Route 
          path='/worker-details/:id'
          element={user ? <WorkerDetails /> : <Navigate to="/login" />}
        />

        <Route 
          path='/view-status'
          element={user ? <ViewApplicationStatus /> : <Navigate to="/login" />}
        />

        <Route path="/payment/verify" element={<PaymentVerify />} />

      </Routes>

      <Toaster />
    </div>
  )
}

export default App