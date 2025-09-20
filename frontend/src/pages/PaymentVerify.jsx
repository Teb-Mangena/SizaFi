// PaymentVerify.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { axiosInstance } from '../lib/axios';
import { CheckCircle, XCircle, ArrowLeft, Calendar, User, CreditCard } from 'lucide-react';

function PaymentVerify() {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [error, setError] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const reference = searchParams.get('reference');
  const trxref = searchParams.get('trxref');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axiosInstance.get(`/payment/verify/${reference || trxref}`);
        
        // Check the response structure
        if (response.data.success && response.data.payment.status === 'success') {
          setVerificationStatus('success');
          setPaymentDetails(response.data.payment);
        } else {
          setVerificationStatus('failed');
          setError(response.data.message || 'Payment verification failed');
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        setVerificationStatus('failed');
        setError(error.response?.data?.message || 'An error occurred while verifying your payment');
      }
    };

    if (reference || trxref) {
      verifyPayment();
    } else {
      setVerificationStatus('failed');
      setError('No payment reference found');
    }
  }, [reference, trxref]);

  if (verificationStatus === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-primary mb-6">
          <ArrowLeft size={18} className="mr-2" />
          Back to Home
        </Link>

        <div className="bg-white rounded-lg shadow-md p-6">
          {verificationStatus === 'success' ? (
            <>
              <div className="text-center mb-6">
                <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                <p className="text-gray-600">
                  Thank you for your payment. Your booking has been confirmed.
                </p>
              </div>

              {paymentDetails && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Booking Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        <Calendar size={18} className="mr-2" />
                        Booking Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reference:</span>
                          <span className="font-medium">{paymentDetails.reference}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Date:</span>
                          <span className="font-medium">
                            {new Date(paymentDetails.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium capitalize">{paymentDetails.worker.role}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount:</span>
                          <span className="font-medium">
                            R{paymentDetails.amount} {paymentDetails.currency}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Worker Details */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        <User size={18} className="mr-2" />
                        Worker Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-medium">{paymentDetails.worker.fullname}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{paymentDetails.worker.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service:</span>
                          <span className="font-medium capitalize">{paymentDetails.worker.role}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-3 flex items-center">
                      <CreditCard size={18} className="mr-2" />
                      Payment Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className="font-medium text-green-600 capitalize">{paymentDetails.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium capitalize">
                          {paymentDetails.paystackData?.channel || 'Card'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid At:</span>
                        <span className="font-medium">
                          {new Date(paymentDetails.paystackData?.paidAt || paymentDetails.updatedAt).toLocaleString()}
                        </span>
                      </div>
                      {paymentDetails.paystackData?.authorization && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Card:</span>
                          <span className="font-medium">
                            **** **** **** {paymentDetails.paystackData.authorization.last4}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 text-center">
                <Link to="/" className="btn btn-primary mr-4">
                  Continue to Dashboard
                </Link>
                <Link to="/workers" className="btn btn-outline">
                  Book Another Service
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <XCircle size={64} className="text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                <p className="text-gray-600 mb-6">
                  {error || 'Your payment could not be processed. Please try again.'}
                </p>
              </div>

              <div className="text-center">
                <Link to="/workers" className="btn btn-primary mr-4">
                  Try Again
                </Link>
                <Link to="/" className="btn btn-outline">
                  Go Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentVerify;