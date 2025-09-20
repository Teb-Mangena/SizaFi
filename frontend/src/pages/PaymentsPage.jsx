import { useState, useEffect } from 'react';
import { axiosInstance } from "../lib/axios";
import { Calendar, User, CreditCard, CheckCircle, XCircle, Clock, DollarSign, Filter, Download, Search, TrendingUp } from 'lucide-react';

function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Format currency to ZAR
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'success':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 flex items-center gap-1 w-fit"><CheckCircle size={12} /> Completed</span>;
      case 'pending':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit"><Clock size={12} /> Pending</span>;
      case 'failed':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 flex items-center gap-1 w-fit"><XCircle size={12} /> Failed</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 flex items-center gap-1 w-fit">{status}</span>;
    }
  };

  // Filter payments based on status and search term
  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === 'all' || payment.status === filter;
    const matchesSearch = 
      payment.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.worker?.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.user?.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.worker?.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Calculate total amounts
  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const successfulPayments = filteredPayments.filter(p => p.status === 'success');
  const successAmount = successfulPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        const response = await axiosInstance.get('/payment/history');
        setPayments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError('Failed to load payment history');
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center text-center">
            <XCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Payments</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CreditCard size={32} className="text-primary" />
            Payment History
          </h1>
          <p className="text-gray-600 mt-2">View and manage all your transaction records</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredPayments.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard size={20} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(totalAmount)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{formatCurrency(successAmount)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by reference, name, or service..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-3">
              <Filter size={18} className="text-gray-500" />
              <select 
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="success">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {filteredPayments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filter !== 'all' ? 'No matching payments found' : 'No payment history yet'}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || filter !== 'all' 
                  ? 'Try adjusting your search or filter criteria' 
                  : 'Your payment transactions will appear here once you start booking services'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client/Worker</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredPayments.map(payment => (
                    <tr key={payment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} className="text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-medium text-gray-900">{formatDate(payment.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                          {payment.paystackData?.metadata?.custom_fields?.find(f => f.variable_name === 'service')?.value || 
                           payment.worker?.role || 
                           'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User size={14} className="text-primary" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.worker ? payment.worker.fullname : payment.user?.fullname || 'N/A'}
                            </div>
                            {payment.worker && (
                              <div className="text-xs text-gray-500 capitalize">{payment.worker.role}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <DollarSign size={14} className="text-gray-400" />
                          <span className="text-sm font-semibold text-gray-900">{formatCurrency(payment.amount)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4">
                        <code className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded font-mono">
                          {payment.reference}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination (can be implemented later) */}
        {filteredPayments.length > 0 && (
          <div className="flex items-center justify-between mt-6 px-4">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{filteredPayments.length}</span> of <span className="font-medium">{payments.length}</span> payments
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentsPage;