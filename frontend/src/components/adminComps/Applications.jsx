import { useState, useEffect } from 'react';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-hot-toast';
import { 
  FileText, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Users, 
  Mail, 
  Download,
  Eye,
  Clock,
  AlertCircle,
  X,
  FileCheck
} from 'lucide-react';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/application');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter(app => 
    filterStatus === 'all' || app.status === filterStatus
  );

  const handleApprove = async () => {
    if (!selectedApp) return;
    
    setProcessing(true);
    try {
      await axiosInstance.put(`/application/${selectedApp._id}/review`, {
        status: 'approved'
      });
      
      toast.success('Application approved successfully');
      setShowApproveModal(false);
      setSelectedApp(null);
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    
    setProcessing(true);
    try {
      await axiosInstance.put(`/application/${selectedApp._id}/review`, {
        status: 'rejected',
        description: rejectReason
      });
      
      toast.success('Application rejected successfully');
      setShowRejectModal(false);
      setSelectedApp(null);
      setRejectReason('');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const openApproveModal = (application) => {
    setSelectedApp(application);
    setShowApproveModal(true);
  };

  const openRejectModal = (application) => {
    setSelectedApp(application);
    setShowRejectModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <div className="flex gap-3">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
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
                  <h4 className="font-semibold">{application.fullname}</h4>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Mail size={14} />
                    <span>{application.email}</span>
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
            
            {/* PDF Document */}
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-gray-400" />
                  <span className="font-medium">{application.pdf.fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{formatFileSize(application.pdf.size)}</span>
                  <a
                    href={application.pdf.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    <Eye size={14} />
                  </a>
                  <a
                    href={application.pdf.url}
                    download
                    className="btn btn-ghost btn-sm"
                  >
                    <Download size={14} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Admin Feedback if exists */}
            {application.description && (
              <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-md">
                <h5 className="font-medium text-blue-800 text-sm">Admin Feedback</h5>
                <p className="text-sm text-blue-700 mt-1">{application.description}</p>
              </div>
            )}
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>Applied on {formatDate(application.createdAt)}</span>
              </div>
              
              {application.status === 'pending' && (
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <button 
                    className="btn btn-success btn-sm"
                    onClick={() => openApproveModal(application)}
                  >
                    <CheckCircle size={14} className="mr-1" />
                    Approve
                  </button>
                  <button 
                    className="btn btn-error btn-sm"
                    onClick={() => openRejectModal(application)}
                  >
                    <XCircle size={14} className="mr-1" />
                    Reject
                  </button>
                </div>
              )}
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

      {/* Approve Confirmation Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Approve Application</h3>
              <button 
                onClick={() => setShowApproveModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={processing}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium">Confirm Approval</h4>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to approve {selectedApp?.fullname}'s application for {selectedApp?.service}?
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowApproveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2"
                disabled={processing}
              >
                {processing && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>}
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Reject Application</h3>
              <button 
                onClick={() => setShowRejectModal(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={processing}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-full">
                  <XCircle size={24} className="text-red-600" />
                </div>
                <div>
                  <h4 className="font-medium">Confirm Rejection</h4>
                  <p className="text-sm text-gray-600">
                    Are you sure you want to reject {selectedApp?.fullname}'s application for {selectedApp?.service}?
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for rejection (required)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  rows={3}
                  placeholder="Please provide a reason for rejecting this application..."
                  disabled={processing}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={processing}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
                disabled={processing || !rejectReason.trim()}
              >
                {processing && <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>}
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;