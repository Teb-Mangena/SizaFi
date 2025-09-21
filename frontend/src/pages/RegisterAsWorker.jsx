import { useState } from "react";
import { useNavigate } from "react-router";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import {
  FileText,
  Upload,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Briefcase,
  Shield,
  X,
  FileCheck,
} from "lucide-react";

function RegisterAsWorker() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    service: "",
    pdf: null,
    pdfName: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files[0];

      // Validate file type (PDF only)
      if (file && !file.type.includes("pdf")) {
        setErrors((prev) => ({ ...prev, pdf: "Only PDF files are allowed" }));
        return;
      }

      // Validate file size (max 5MB)
      if (file && file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          pdf: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        pdf: file,
        pdfName: file?.name || "",
      }));

      // Clear error if file is valid
      if (errors.pdf) {
        setErrors((prev) => ({
          ...prev,
          pdf: "",
        }));
      }
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.service) {
      newErrors.service = "Service category is required";
    }

    if (!formData.pdf) {
      newErrors.pdf = "Certificate is required";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Show confirmation modal instead of submitting directly
    setShowConfirmation(true);
  };

  const confirmSubmission = async () => {
    setIsSubmitting(true);
    setShowConfirmation(false);

    try {
      const submitData = new FormData();
      submitData.append("service", formData.service);
      submitData.append("pdf", formData.pdf);

      console.log("Submitting form data:", {
        service: formData.service,
        pdf: formData.pdf?.name,
      });

      const response = await axiosInstance.post(
        "/application/apply",
        submitData
      );

      console.log("API response:", response.data);

      toast.success(
        "Application submitted successfully! It will be reviewed within 3-5 business days."
      );

      setFormData({
        service: "",
        pdf: null,
        pdfName: "",
        agreeToTerms: false,
      });

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      console.error("Submission error:", error);

      let errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        (error.response?.status === 500
          ? "Server error. Please try again later or contact support."
          : "Failed to submit application. Please try again.");

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const confirmSubmission = async () => {
  //   setIsSubmitting(true);
  //   setShowConfirmation(false);

  //   try {
  //     // Create FormData for file upload
  //     const submitData = new FormData();
  //     submitData.append('service', formData.service);
  //     submitData.append('pdf', formData.pdf);

  //     // Log the form data for debugging
  //     console.log('Submitting form data:', {
  //       service: formData.service,
  //       pdf: formData.pdf?.name
  //     });

  //     // Submit to API
  //     const response = await axiosInstance.post('/application/apply', submitData);

  //     console.log('API response:', response.data);

  //     // Success toast
  //     toast.success('Application submitted successfully! It will be reviewed within 3-5 business days.');

  //     // Reset form
  //     setFormData({
  //       service: '',
  //       pdf: null,
  //       pdfName: '',
  //       agreeToTerms: false
  //     });

  //     // Navigate after a short delay to allow toast to be seen
  //     setTimeout(() => {
  //       navigate('/');
  //     }, 2000);
  //   } catch (error) {
  //     console.error('Submission error:', error);

  //     // More detailed error logging
  //     if (error.response) {
  //       console.error('Server responded with:', error.response.status, error.response.data);
  //     } else if (error.request) {
  //       console.error('No response received:', error.request);
  //     } else {
  //       console.error('Request setup error:', error.message);
  //     }

  //     let errorMessage = 'Failed to submit application. Please try again.';

  //     if (error.response?.data?.message) {
  //       errorMessage = error.response.data.message;
  //     } else if (error.response?.status === 500) {
  //       errorMessage = 'Server error. Please try again later or contact support.';
  //     }

  //     toast.error(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const redirectToCertification = () => {
    window.open("https://www.telkomlearn.co.za/courses", "_blank");
  };

  const services = [
    "plumber",
    "electrician",
    "carpenter",
    "painter",
    "gardener",
    "cleaner",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <h1 className="text-2xl font-bold">
              Register as a Service Professional
            </h1>
            <p className="mt-2">
              Join our network of skilled professionals and start earning
            </p>
          </div>

          <div className="p-6">
            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Certification Requirement
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      All service professionals must have valid certification
                      for their trade. Applications without proper certification
                      will be rejected.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certification Guidance */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <BookOpen className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Need certification?
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      If you don't have the required certification, you can
                      obtain it through accredited training programs. We
                      recommend the following resource:
                    </p>
                    <button
                      onClick={redirectToCertification}
                      className="mt-2 inline-flex items-center text-blue-600 hover:text-blue-500 font-medium"
                    >
                      Get certified at Telkom Learn
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Category *</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-gray-400" />
                  </div>
                  <select
                    name="service"
                    className={`select select-bordered w-full pl-10 ${
                      errors.service ? "select-error" : ""
                    }`}
                    value={formData.service}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  >
                    <option value="">Select your service category</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service.charAt(0).toUpperCase() + service.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.service && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.service}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">
                    Professional Certificate (PDF only) *
                  </span>
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center ${
                    errors.pdf ? "border-error" : "border-gray-300"
                  } ${isSubmitting ? "opacity-50" : ""}`}
                >
                  <input
                    type="file"
                    id="pdf"
                    name="pdf"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf"
                    disabled={isSubmitting}
                  />

                  {formData.pdf ? (
                    <div className="flex flex-col items-center">
                      <FileCheck size={48} className="text-green-500 mb-2" />
                      <p className="font-medium">{formData.pdfName}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {(formData.pdf.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => document.getElementById("pdf").click()}
                        className="btn btn-ghost btn-sm mt-2"
                        disabled={isSubmitting}
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={48} className="text-gray-400 mb-2" />
                      <p className="font-medium">
                        Upload your professional certificate
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF files only (max 5MB)
                      </p>
                      <button
                        type="button"
                        onClick={() => document.getElementById("pdf").click()}
                        className="btn btn-outline btn-sm mt-4"
                        disabled={isSubmitting}
                      >
                        Select PDF file
                      </button>
                    </div>
                  )}
                </div>
                {errors.pdf && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.pdf}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label justify-start cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    className="checkbox checkbox-primary mr-3"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    disabled={isSubmitting}
                  />
                  <span className="label-text">
                    I agree to the{" "}
                    <a href="/terms" className="link link-primary">
                      Terms and Conditions
                    </a>{" "}
                    and confirm that all information provided is accurate
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {errors.agreeToTerms}
                    </span>
                  </label>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Shield size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Verification Process</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your application will be reviewed within 3-5 business
                      days. We will verify your certification and contact you
                      for any additional information if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>

                <button
                  type="button"
                  onClick={redirectToCertification}
                  className="btn btn-outline gap-2"
                  disabled={isSubmitting}
                >
                  <BookOpen size={18} />
                  Get Certified First
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold">Confirm Submission</h3>
              <button
                onClick={() => setShowConfirmation(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-full">
                  <FileText size={24} className="text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">Application Review</h4>
                  <p className="text-sm text-gray-600">
                    Please confirm your details before submitting
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium capitalize">
                    {formData.service}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificate:</span>
                  <span className="font-medium">{formData.pdfName}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmission}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <span className="loading loading-spinner loading-sm"></span>
                )}
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterAsWorker;
