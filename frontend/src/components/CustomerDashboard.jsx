import { Link } from "react-router";
import { useAuthStore } from "../store/authStore";
import { 
  MessageCircle, 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  CreditCard,
  Settings,
  Bell,
  Search,
  Filter
} from "lucide-react";

function CustomerDashboard() {
  const { user } = useAuthStore();

  console.log({user})

  // Sample data for demonstration
  const services = [
    { id: 1, name: "Plumbing", icon: "🚰", available: 12 },
    { id: 2, name: "Electrical", icon: "⚡", available: 8 },
    { id: 3, name: "Carpentry", icon: "🪚", available: 5 },
    { id: 4, name: "Painting", icon: "🎨", available: 7 },
    { id: 5, name: "Cleaning", icon: "🧹", available: 15 },
    { id: 6, name: "Gardening", icon: "🌿", available: 6 },
  ];

  const recentBookings = [
    { id: 1, service: "Plumbing", worker: "John Smith", date: "2023-06-15", status: "Completed", rating: 4.5 },
    { id: 2, service: "Electrical", worker: "Emma Johnson", date: "2023-06-18", status: "In Progress", rating: null },
    { id: 3, service: "Cleaning", worker: "Mike Williams", date: "2023-06-10", status: "Completed", rating: 4.8 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button className="btn btn-ghost btn-circle">
              <Bell size={20} />
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt={user.fullname} />
                  ) : (
                    <span className="text-lg font-semibold">
                      {user?.fullname?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
              </div>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li className="px-4 py-2 border-b border-base-300">
                  <div className="font-semibold">{user?.fullname || 'User'}</div>
                  <div className="text-xs text-gray-500">{user?.email || ''}</div>
                </li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </header> */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-xl p-6 mb-8 shadow-md">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back, {user?.fullname || 'Valued Customer'}!
          </h2>
          <p className="opacity-90">What would you like to do today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link to="/book-service" className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mb-2">
                <Calendar size={24} />
              </div>
              <h3 className="card-title text-lg">Book a Service</h3>
              <p className="text-sm text-gray-500">Schedule a new service</p>
            </div>
          </Link>

          <Link to="/messages" className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mb-2">
                <MessageCircle size={24} />
              </div>
              <h3 className="card-title text-lg">Messages</h3>
              <p className="text-sm text-gray-500">Chat with service providers</p>
            </div>
          </Link>

          <Link to="/my-bookings" className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mb-2">
                <Clock size={24} />
              </div>
              <h3 className="card-title text-lg">My Bookings</h3>
              <p className="text-sm text-gray-500">View your appointments</p>
            </div>
          </Link>

          <Link to="/payment-methods" className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
            <div className="card-body items-center text-center">
              <div className="p-3 rounded-full bg-orange-100 text-orange-600 mb-2">
                <CreditCard size={24} />
              </div>
              <h3 className="card-title text-lg">Payments</h3>
              <p className="text-sm text-gray-500">Manage payment methods</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Services Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Popular Services</h2>
              <Link to="/services" className="text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map(service => (
                <div key={service.id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="card-body">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{service.icon}</span>
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="text-sm text-gray-500">{service.available} providers available</p>
                        </div>
                      </div>
                      <Link 
                        to={`/book-service?category=${service.name.toLowerCase()}`}
                        className="btn btn-primary btn-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Bookings</h2>
              <Link to="/my-bookings" className="text-primary hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {recentBookings.map(booking => (
                <div key={booking.id} className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{booking.service}</h3>
                        <p className="text-sm text-gray-500">with {booking.worker}</p>
                        <p className="text-xs text-gray-400">{booking.date}</p>
                      </div>
                      <div className="text-right">
                        <span className={`badge ${booking.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.status}
                        </span>
                        {booking.rating && (
                          <div className="flex items-center mt-1">
                            <Star size={14} className="text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{booking.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {booking.status === 'Completed' && !booking.rating && (
                      <button className="btn btn-outline btn-sm mt-2">Rate Service</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CustomerDashboard;