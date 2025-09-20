import { useState } from "react";
import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react";

function LoginPage() {
  const { isLoggingIn, login } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
            <p className="text-gray-500 mt-2">Log in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input-group">
                <span className="bg-base-200">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  placeholder="Enter your email address"
                  className="input input-bordered w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required 
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <label className="input-group">
                <span className="bg-base-200">
                  <Lock size={18} />
                </span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  className="input input-bordered w-full"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required 
                />
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </label>
              
              <label className="label">
                <Link to="/forgot-password" className="label-text-alt link link-primary">
                  Forgot password?
                </Link>
              </label>
            </div>

            <div className="form-control mt-6">
              <button 
                type="submit" 
                className={`btn btn-primary ${isLoggingIn ? 'loading' : ''}`}
                disabled={isLoggingIn}
              >
                {isLoggingIn ? 'Logging in...' : 'Log In'}
                {!isLoggingIn && <LogIn size={18} className="ml-2" />}
              </button>
            </div>
          </form>
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="divider">OR</div>
          
          <div className="flex flex-col gap-2">
            <button className="btn btn-outline gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;