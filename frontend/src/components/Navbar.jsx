import { useState } from 'react';
import { Link } from 'react-router';
import { 
  MessageCircle, 
  Users, 
  LogOut, 
  User, 
  Settings, 
  Menu, 
  X 
} from 'lucide-react';
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
  const { user,logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // const navigate = useNavigate();

  const handleLogout = async () => {
    logout();
  };

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 px-4">
      {/* Mobile menu button */}
      <div className="navbar-start">
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
          {isMenuOpen && (
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => setIsMenuOpen(false)}
            >
              <li>
                <Link to="/workers" className="flex items-center gap-2">
                  <Users size={18} />
                  All Workers
                </Link>
              </li>
              <li>
                <Link to="/messages" className="flex items-center gap-2">
                  <MessageCircle size={18} />
                  Messages
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link to="/profile" className="flex items-center gap-2">
                      <User size={18} />
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="flex items-center gap-2">
                      <LogOut size={18} />
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/login" className="flex items-center gap-2">
                    <LogOut size={18} />
                    Login
                  </Link>
                </li>
              )}
            </ul>
          )}
        </div>
        
        {/* Logo */}
        <Link to="/" className="btn btn-ghost text-xl">
          <div className="bg-primary text-primary-content p-2 rounded-lg">
            <MessageCircle size={24} />
          </div>
          <span className="ml-2 font-bold">SizaFi</span>
        </Link>
      </div>

      {/* Desktop navigation */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link to="/workers" className="flex items-center gap-1 btn btn-ghost">
              <Users size={20} />
              <span>Workers</span>
            </Link>
          </li>
          <li>
            <Link to="/messages" className="flex items-center gap-1 btn btn-ghost">
              <MessageCircle size={20} />
              <span>Messages</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* User section */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar online flex items-center justify-center"
            >
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {user.profilePic ? (
                  <img 
                    src={user.profilePic} 
                    alt={user.fullname} 
                    className="rounded-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-semibold">
                    {user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                  </span>
                )}
              </div>
            </div>
            <ul 
              tabIndex={0} 
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="px-4 py-2 border-b border-base-300">
                <div className="font-semibold">{user.fullname}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </li>
              <li>
                <Link to="/profile" className="flex items-center gap-2">
                  <User size={18} />
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings size={18} />
                  Settings
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className="flex items-center gap-2">
                  <LogOut size={18} />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary gap-2">
            <LogOut size={18} />
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;