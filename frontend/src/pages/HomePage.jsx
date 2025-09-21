import CustomerDashboard from "../components/CustomerDashboard";
import WorkerDashboard from "../components/WorkerDashboard";
import AdminDashboard from "../components/AdminDashboard"
import { useAuthStore } from "../store/authStore";

function HomePage() {
  const { user } = useAuthStore();
  
  // Define worker roles
  const workerRoles = ['plumber', 'electrician', 'carpenter', 'painter', 'gardener', 'cleaner'];
  
  // Check if user is a worker
  const isWorker = user && workerRoles.includes(user.role);

  return (
    <>
      {user ? (
        <>
          {user.role === 'user' && <CustomerDashboard />}
          {user.role === 'admin' && <AdminDashboard />}
          {isWorker && <WorkerDashboard />}
        </>
      ) : (
        // Show a landing page or redirect to login if not authenticated
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to SizaFi</h1>
            <p className="text-lg mb-6">Connect with skilled professionals for all your home service needs</p>
            <div className="flex justify-center gap-4">
              <a href="/login" className="btn btn-primary">Login</a>
              <a href="/signup" className="btn btn-outline">Sign Up</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;