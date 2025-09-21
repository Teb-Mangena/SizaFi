import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { FileText, Search, Filter, CheckCircle, XCircle, Users, Mail } from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        // In a real app, you would fetch from the applications endpoint
        // For now, using mock data
        const mockApplications = [
          {
            _id: '1',
            userId: {
              fullname: 'John Doe',
              email: 'john@example.com'
            },
            service: 'plumber',
            description: 'Experienced plumber with 5 years of experience',
            status: 'pending',
            createdAt: new Date().toISOString()
          },
          {
            _id: '2',
            userId: {
              fullname: 'Jane Smith',
              email: 'jane@example.com'
            },
            service: 'electrician',
            description: 'Certified electrician specializing in residential work',
            status: 'pending',
            createdAt: new Date().toISOString()
          }
        ];
        setApplications(mockApplications);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  const handleApprove = (appId) => {
    console.log('Approving application:', appId);
    // API call to approve application
  };

  const handleReject = (appId) => {
    console.log('Rejecting application:', appId);
    // API call to reject application
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h3 className="font-semibold text-gray-900">Worker Applications</h3>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {filteredApplications.map((application) => (
          <div key={application._id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold">{application.userId?.fullname || 'Unknown User'}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail size={14} />
                    <span>{application.userId?.email || 'No email'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  application.status === 'approved' ? 'bg-green-100 text-green-800' :
                  application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {application.service}
                </span>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">{application.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <p className="text-sm text-gray-500">
                  Applied on {new Date(application.createdAt).toLocaleDateString()}
                </p>
                {application.status === 'pending' && (
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <button 
                      className="btn btn-success btn-sm"
                      onClick={() => handleApprove(application._id)}
                    >
                      <CheckCircle size={14} className="mr-1" />
                      Approve
                    </button>
                    <button 
                      className="btn btn-error btn-sm"
                      onClick={() => handleReject(application._id)}
                    >
                      <XCircle size={14} className="mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredApplications.length === 0 && (
        <div className="text-center py-8">
          <FileText size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No applications found</p>
        </div>
      )}
    </div>
  );
};

export default Applications;