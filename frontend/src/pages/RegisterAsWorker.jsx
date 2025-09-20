import { useState } from 'react';
import { useNavigate } from 'react-router';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  BookOpen,
  User,
  Mail,
  Briefcase,
  Shield
} from 'lucide-react';

function RegisterAsWorker() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    role: '',
    certificate: null,
    certificateName: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        certificate: files[0],
        certificateName: files[0]?.name || ''
      }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.role) {
      newErrors.role = 'Please select a service category';
    }
    
    if (!formData.certificate) {
      newErrors.certificate = 'Certificate is required';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Application submitted successfully! It will be reviewed within 3-5 business days.');
      navigate('/');
    }, 2000);
  };

  const redirectToCertification = () => {
    window.open('https://www.telkomlearn.co.za/courses', '_blank');
  };

  const workerRoles = [
    'plumber',
    'electrician',
    'carpenter',
    'painter',
    'gardener',
    'cleaner'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <h1 className="text-2xl font-bold">Register as a Service Professional</h1>
            <p className="mt-2">Join our network of skilled professionals and start earning</p>
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
                      All service professionals must have valid certification for their trade. 
                      Applications without proper certification will be rejected.
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
                      If you don't have the required certification, you can obtain it through 
                      accredited training programs. We recommend the following resource:
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Full Name</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="fullname"
                      placeholder="Your full name"
                      className={`input input-bordered w-full pl-10 ${errors.fullname ? 'input-error' : ''}`}
                      value={formData.fullname}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.fullname && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.fullname}</span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Email Address</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your email address"
                      className={`input input-bordered w-full pl-10 ${errors.email ? 'input-error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <label className="label">
                      <span className="label-text-alt text-error">{errors.email}</span>
                    </label>
                  )}
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Service Category</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase size={18} className="text-gray-400" />
                  </div>
                  <select
                    name="role"
                    className={`select select-bordered w-full pl-10 ${errors.role ? 'select-error' : ''}`}
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="">Select your service category</option>
                    {workerRoles.map(role => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.role}</span>
                  </label>
                )}
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Professional Certificate</span>
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.certificate ? 'border-error' : 'border-gray-300'}`}>
                  <input
                    type="file"
                    id="certificate"
                    name="certificate"
                    className="hidden"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  
                  {formData.certificate ? (
                    <div className="flex flex-col items-center">
                      <CheckCircle size={48} className="text-green-500 mb-2" />
                      <p className="font-medium">{formData.certificateName}</p>
                      <button
                        type="button"
                        onClick={() => document.getElementById('certificate').click()}
                        className="btn btn-ghost btn-sm mt-2"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload size={48} className="text-gray-400 mb-2" />
                      <p className="font-medium">Upload your professional certificate</p>
                      <p className="text-sm text-gray-500 mt-1">PDF, DOC, or image files (max 5MB)</p>
                      <button
                        type="button"
                        onClick={() => document.getElementById('certificate').click()}
                        className="btn btn-outline btn-sm mt-4"
                      >
                        Select file
                      </button>
                    </div>
                  )}
                </div>
                {errors.certificate && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.certificate}</span>
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
                  />
                  <span className="label-text">
                    I agree to the{' '}
                    <a href="/terms" className="link link-primary">
                      Terms and Conditions
                    </a>
                    {' '}and confirm that all information provided is accurate
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.agreeToTerms}</span>
                  </label>
                )}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Shield size={20} className="text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Verification Process</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Your application will be reviewed within 3-5 business days. 
                      We will verify your certification and contact you for any additional information if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary ${isSubmitting ? 'loading' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
                
                <button
                  type="button"
                  onClick={redirectToCertification}
                  className="btn btn-outline gap-2"
                >
                  <BookOpen size={18} />
                  Get Certified First
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterAsWorker;