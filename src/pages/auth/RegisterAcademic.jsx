import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAcademic } from '../../services/auth.service';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';
import GlobalHeader from '../../components/common/GlobalHeader';

/**
 * Academic Register Page
 * Allows new academic staff to register
 * Uses POST /api/academic/register
 */
const RegisterAcademic = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    academicId: '',
    password: '',
    confirmPassword: '',
    designation: '',
    codeword: '',
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
      const response = await registerAcademic(registerData);
      
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
        <h2 className="text-2xl font-bold text-center mb-6">Academic Registration</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
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
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Academic ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic ID *
            </label>
            <input
              type="text"
              name="academicId"
              value={formData.academicId}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter academic ID"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation
            </label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter designation (optional)"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
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
              Confirm Password *
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

          {/* Authorization Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Authorization Code *
            </label>
            <input
              type="text"
              name="codeword"
              value={formData.codeword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter authorization code"
              required
              autoComplete="off"
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

export default RegisterAcademic;

