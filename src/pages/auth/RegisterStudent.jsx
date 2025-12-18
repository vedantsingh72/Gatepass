import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudent } from '../../services/auth.service';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';
import GlobalHeader from '../../components/common/GlobalHeader';
import { DEPARTMENTS } from '../../utils/constants';

/**
 * Student Register Page
 * Allows new students to register
 * Uses POST /api/users/register
 */
const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    registrationNo: '',
    department: '',
    year: '',
    hostel: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      // Prepare data for backend (exclude confirmPassword)
      const { confirmPassword, ...registerData } = formData;
      
      // Call register API - axios interceptor returns response.data
      const response = await registerStudent(registerData);
      
      // Backend returns ApiResponse: { statusCode, success, message, data }
      // Check if account is already verified (development mode)
      const isVerified = response?.data?.isVerified || false;
      const message = response?.message || 'Registration successful!';
      
      if (isVerified || message.includes('development mode')) {
        // Development mode: Account already verified, go to login
        navigate('/login', { 
          state: { message: 'Registration successful! You can login now.' } 
        });
      } else {
        // Production mode: Need OTP verification
        navigate('/verify-otp', { 
          state: { email: formData.email, message: 'Registration successful! Please verify your email.' } 
        });
      }
    } catch (err) {
      // Handle backend validation errors
      // Error can be from axios interceptor or backend response
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err?.message) {
        errorMessage = err.message;
      } else if (err?.data?.message) {
        errorMessage = err.data.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Registering..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <GlobalHeader />
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Student Registration</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your roll number"
              required
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your registration number"
              required
            />
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year (Optional)</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* Hostel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hostel
            </label>
            <input
              type="text"
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your hostel name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email address"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              A verification code will be sent to this email
            </p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password (min 6 characters)"
              required
              minLength={6}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm your password"
              required
              minLength={6}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Register
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default RegisterStudent;

