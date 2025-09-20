import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { axiosInstance } from "../lib/axios";
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  Star, 
  MapPin, 
  Phone,
  MessageCircle,
  ArrowLeft,
  X
} from 'lucide-react';
import { Link } from "react-router";

function WorkerDetails() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkerDetails = async () => {
      try {
        const res = await axiosInstance.get(`/workers/${id}`);
        setWorker(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching worker details:', error);
        setError('Failed to load worker details');
        setLoading(false);
      }
    };

    fetchWorkerDetails();
  }, [id]);

  const handleBookService = async () => {
    setIsProcessing(true);
    try {
      const response = await axiosInstance.post('/payment/initialize', {
        amount: 250,
        workerId: id,
        callback_url: `${window.location.origin}/payment/verify`
      });
      
      setPaymentData(response.data);
      // Redirect to Paystack checkout page
      window.location.href = response.data.authorization_url;
    } catch (error) {
      console.error('Error initializing payment:', error);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsProcessing(false);
      setShowBookingModal(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{error}</div>
          <Link to="/workers" className="btn btn-primary">
            Back to Workers
          </Link>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 mb-4">Worker not found</div>
          <Link to="/workers" className="btn btn-primary">
            Back to Workers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link to="/workers" className="inline-flex items-center text-primary mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to Workers
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-4 md:mb-0 md:mr-6">
                {worker.profilePic ? (
                  <img 
                    src={worker.profilePic} 
                    alt={worker.fullname} 
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white text-primary flex items-center justify-center border-4 border-white">
                    <User size={48} />
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-bold">{worker.fullname}</h1>
                <p className="opacity-90 capitalize">{worker.role}</p>
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="ml-1">4.8</span>
                  <span className="mx-2">•</span>
                  <span>24 reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <User size={20} className="mr-2" />
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail size={18} className="text-gray-500 mr-3" />
                    <span>{worker.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={18} className="text-gray-500 mr-3" />
                    <span className="text-gray-500">Not provided</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={18} className="text-gray-500 mr-3" />
                    <span className="text-gray-500">Location not specified</span>
                  </div>
                </div>
              </div>

              {/* Professional Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Briefcase size={20} className="mr-2" />
                  Professional Details
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-24">Service:</span>
                    <span className="capitalize">{worker.role}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Experience:</span>
                    <span>5+ years</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Response Time:</span>
                    <span>Within 2 hours</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-24">Rate:</span>
                    <span className="text-primary font-semibold">R250 per day</span>
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">About</h2>
              <p className="text-gray-600">
                {worker.fullname} is a professional {worker.role} with over 5 years of experience. 
                Specializing in residential and commercial services, they provide high-quality work 
                with attention to detail and customer satisfaction.
              </p>
            </div>

            {/* Services Section */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4">Services Offered</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {worker.role === 'plumber' && (
                  <>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Pipe Installation</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Leak Repair</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Drain Cleaning</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Faucet Repair</span>
                  </>
                )}
                {worker.role === 'electrician' && (
                  <>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Wiring Installation</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Lighting Solutions</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Electrical Repairs</span>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">Safety Inspections</span>
                  </>
                )}
                {worker.role === 'carpenter' && (
                  <>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Furniture Making</span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Cabinet Installation</span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Wood Repairs</span>
                    <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">Custom Woodwork</span>
                  </>
                )}
                {/* Add more roles as needed */}
              </div>
            </div>

            {/* Membership Details */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar size={20} className="mr-2" />
                Membership Details
              </h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div>Member since: {new Date(worker.createdAt).toLocaleDateString()}</div>
                <div>Last updated: {new Date(worker.updatedAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn btn-primary flex-1" onClick={() => navigate("/messages")} >
                <MessageCircle size={18} className="mr-2" />
                Send Message
              </button>
              <button className="btn btn-outline flex-1">
                Request Quote
              </button>
              <button 
                className="btn btn-secondary flex-1"
                onClick={() => setShowBookingModal(true)}
              >
                Book Service
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Confirm Booking</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to book {worker.fullname}'s services for R250?
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-2">Booking Summary:</h4>
                <div className="text-sm text-gray-600">
                  <p>Service: {worker.role}</p>
                  <p>Worker: {worker.fullname}</p>
                  <p>Amount: R250</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isProcessing}
              >
                Cancel
              </button>
              <button
                onClick={handleBookService}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkerDetails;