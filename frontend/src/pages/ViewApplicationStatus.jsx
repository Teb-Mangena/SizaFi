import { useState, useEffect } from 'react';
import { axiosInstance } from '../lib/axios';
import { toast } from 'react-hot-toast';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Calendar,
  User,
  Mail,
  Briefcase,
  RefreshCw
} from 'lucide-react';

function ViewApplicationStatus() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('/application/mine');
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'rejected':
        return <XCircle size={20} className="text-red-500" />;
      default:
        return <Clock size={20} className="text-yellow-500" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center text-center">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Applications</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchApplications}
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold">Application Status</h1>
                <p className="mt-2">View the status of your service professional applications</p>
              </div>
              <button
                onClick={fetchApplications}
                className="mt-4 sm:mt-0 flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">
                  You haven't submitted any applications yet. Apply to become a service professional to get started.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((application) => (
                  <div key={application._id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Briefcase size={24} className="text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold capitalize">{application.service}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(application.status)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(application.status)}`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        Applied on {formatDate(application.createdAt)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Applicant Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User size={16} className="text-gray-400" />
                            <span>{application.fullname}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-400" />
                            <span>{application.email}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Document</h4>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText size={16} className="text-gray-400" />
                            <span className="font-medium">{application.pdf.fileName}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatFileSize(application.pdf.size)}</span>
                            <a
                              href={application.pdf.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-primary hover:underline"
                            >
                              <Download size={14} />
                              View PDF
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {application.description && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md mb-4">
                        <h4 className="font-medium text-blue-800 mb-1">Admin Feedback</h4>
                        <p className="text-sm text-blue-700">{application.description}</p>
                      </div>
                    )}

                    {application.status === 'rejected' && application.rejectionReason && (
                      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-md">
                        <h4 className="font-medium text-red-800 mb-1">Rejection Reason</h4>
                        <p className="text-sm text-red-700">{application.rejectionReason}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            <span>Applied: {formatDate(application.createdAt)}</span>
                          </div>
                          {application.updatedAt !== application.createdAt && (
                            <div className="flex items-center gap-1">
                              <span>Updated: {formatDate(application.updatedAt)}</span>
                            </div>
                          )}
                        </div>
                        <div>Application ID: {application._id}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewApplicationStatus;