import { useState, useEffect } from 'react';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  MessageCircle, 
  Clock, 
  TrendingUp,
  User,
  MapPin,
  CheckCircle,
  MoreHorizontal,
  BarChart3,
  PieChart,
  Loader
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { axiosInstance } from "../lib/axios";
import {
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function WorkerDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    completedJobs: 0,
    averageRating: 4.7, // Keeping rating as mock data since not in API
    pendingRequests: 3  // Keeping pending requests as mock data
  });
  
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [recentEarnings, setRecentEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState([]);
  const [clientData, setClientData] = useState([]);

  // Format currency to ZAR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Function to process and transform the API data
  const processEarningsData = (payments) => {
    // Group by month for the earnings chart
    const monthlyEarnings = {};
    const clientEarnings = {};
    
    payments.forEach(payment => {
      // Process monthly earnings
      const date = new Date(payment.createdAt);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      if (!monthlyEarnings[monthYear]) {
        monthlyEarnings[monthYear] = 0;
      }
      monthlyEarnings[monthYear] += payment.amount;
      
      // Process client earnings
      const clientName = payment.user.fullname;
      if (!clientEarnings[clientName]) {
        clientEarnings[clientName] = 0;
      }
      clientEarnings[clientName] += payment.amount;
    });
    
    // Convert to array format for charts
    const monthlyData = Object.keys(monthlyEarnings).map(key => ({
      month: key,
      earnings: monthlyEarnings[key]
    }));
    
    const clientDistribution = Object.keys(clientEarnings).map(key => ({
      client: key,
      amount: clientEarnings[key]
    }));
    
    return { monthlyData, clientDistribution };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch earnings data from the API
        const response = await axiosInstance.get('/payment/worker/earnings');
        const { totalEarnings, payments } = response.data;
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalEarnings,
          completedJobs: payments.length
        }));
        
        // Set recent earnings (last 5 payments)
        setRecentEarnings(payments.slice(0, 5).map(payment => ({
          id: payment._id,
          client: payment.user.fullname,
          service: payment.paystackData.metadata.custom_fields.find(f => f.variable_name === 'service')?.value || 'Service',
          amount: payment.amount,
          date: new Date(payment.createdAt).toLocaleDateString(),
          status: payment.status
        })));
        
        // Process data for charts
        const { monthlyData, clientDistribution } = processEarningsData(payments);
        setEarningsData(monthlyData);
        setClientData(clientDistribution);
        
        // Set upcoming bookings (mock data as it's not in the API)
        setUpcomingBookings([
          {
            id: 1,
            client: 'Sarah Johnson',
            service: 'Plumbing Repair',
            date: '2023-06-20',
            time: '10:00 AM',
            address: '123 Main St, Apt 4B',
            status: 'confirmed'
          },
          {
            id: 2,
            client: 'Michael Brown',
            service: 'Leak Detection',
            date: '2023-06-21',
            time: '2:30 PM',
            address: '456 Oak Ave',
            status: 'confirmed'
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}'s Dashboard</h1>
          <p className="text-gray-600 mt-2"><span className='uppercase font-semibold'>{user?.fullname}</span> manage your services and track your performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                <CheckCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Jobs</p>
                <p className="text-2xl font-bold">{stats.completedJobs}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                <Star size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold">{stats.averageRating}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className="text-2xl font-bold">{stats.pendingRequests}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Earnings Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <BarChart3 size={20} className="mr-2 text-blue-500" />
              <h2 className="text-xl font-semibold">Earnings Timeline</h2>
            </div>
            <div className="h-64">
              {earningsData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={earningsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis 
                      tickFormatter={(value) => `R${value}`}
                    />
                    <Tooltip 
                      formatter={(value) => [`R${value}`, 'Earnings']}
                    />
                    <Legend />
                    <Bar dataKey="earnings" fill="#3B82F6" name="Earnings (ZAR)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No earnings data available</p>
                </div>
              )}
            </div>
          </div>

          {/* Client Distribution Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <PieChart size={20} className="mr-2 text-green-500" />
              <h2 className="text-xl font-semibold">Client Distribution</h2>
            </div>
            <div className="h-64">
              {clientData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={clientData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ client, percent }) => `${client}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                    >
                      {clientData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`R${value}`, 'Amount']} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No client data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
            </div>
            <div className="p-6">
              {upcomingBookings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No upcoming bookings</p>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map(booking => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{booking.service}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <User size={14} className="mr-1" />
                            <span>{booking.client}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin size={14} className="mr-1" />
                            <span>{booking.address}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar size={14} className="mr-1" />
                            <span>{booking.date} at {booking.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${booking.status === 'confirmed' ? 'badge-success' : 'badge-warning'}`}>
                            {booking.status}
                          </span>
                          <button className="btn btn-ghost btn-sm mt-2">
                            <MoreHorizontal size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between mt-4">
                        <button className="btn btn-outline btn-sm">
                          <MessageCircle size={16} className="mr-1" />
                          Message
                        </button>
                        <div className="space-x-2">
                          {booking.status === 'pending' && (
                            <>
                              <button className="btn btn-success btn-sm">
                                Accept
                              </button>
                              <button className="btn btn-error btn-sm">
                                Decline
                              </button>
                            </>
                          )}
                          {booking.status === 'confirmed' && (
                            <button className="btn btn-primary btn-sm">
                              View Details
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Earnings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Recent Earnings</h2>
            </div>
            <div className="p-6">
              {recentEarnings.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No earnings yet</p>
              ) : (
                <div className="space-y-4">
                  {recentEarnings.map(earning => (
                    <div key={earning.id} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <div>
                        <h3 className="font-semibold">Service type: {earning.service}</h3>
                        <p className="text-sm text-gray-500">Paid by:{earning.client}</p>
                        <p className="text-sm text-gray-500">On: {earning.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">{formatCurrency(earning.amount)}</p>
                        <span className="badge badge-success badge-sm">{earning.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="btn btn-outline">
              <Calendar size={18} className="mr-2" />
              Set Availability
            </button>
            <button className="btn btn-outline">
              <TrendingUp size={18} className="mr-2" />
              View Performance
            </button>
            <button className="btn btn-outline">
              <MessageCircle size={18} className="mr-2" />
              Message Center
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerDashboard;