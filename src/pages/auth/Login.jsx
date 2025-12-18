import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi, getProfile } from '../../services/auth.service';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';
import GlobalHeader from '../../components/common/GlobalHeader';

/**
 * Login Page
 * Handles authentication for all roles
 */
const Login = () => {
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'user';
  
  const [formData, setFormData] = useState({
    role: roleFromUrl,
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Update role when URL parameter changes
  useEffect(() => {
    if (roleFromUrl && ['user', 'department', 'academic', 'hosteloffice', 'gate'].includes(roleFromUrl)) {
      setFormData(prev => ({ ...prev, role: roleFromUrl }));
    }
  }, [roleFromUrl]);

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
    setLoading(true);

    try {
      // Step 1: Login and get token
      const loginResponse = await loginApi(formData);
      
      // Step 2: Extract data from login response
      const token = loginResponse.data.token;
      const role = loginResponse.data.role;
      const userData = loginResponse.data.user; // User data is already in login response
      
      // Step 3: Save all data and login
      login(token, userData, role);
      
      // Step 4: Redirect based on role
      const roleRoutes = {
        user: '/student/dashboard',
        department: '/department/dashboard',
        academic: '/academic/dashboard',
        hosteloffice: '/hostel/dashboard',
        gate: '/gate/dashboard',
      };
      
      // Use replace to prevent back button issues
      const redirectPath = roleRoutes[role] || '/student/dashboard';
      navigate(redirectPath, { replace: true });
    } catch (err) {
      // Clear token if login fails
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Logging in..." />;
  }

  // Get identifier label based on role
  const getIdentifierLabel = () => {
    const labels = {
      user: 'Roll Number',
      department: 'Department ID',
      academic: 'Academic ID',
      hosteloffice: 'Office ID',
      gate: 'Gate ID',
    };
    return labels[formData.role] || 'Identifier';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <GlobalHeader />
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to Aagman</h2>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="user">Student</option>
              <option value="department">Department</option>
              <option value="academic">Academic Office</option>
              <option value="hosteloffice">Hostel Office</option>
              <option value="gate">Gate</option>
            </select>
          </div>

          {/* Identifier Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {getIdentifierLabel()}
            </label>
            <input
              type="text"
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter your ${getIdentifierLabel().toLowerCase()}`}
              required
            />
          </div>

          {/* Password Field */}
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
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
          >
            Login
          </button>
        </form>

        {/* Register and Forgot Password Links */}
        <div className="mt-4 space-y-2 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:underline">
              Register here
            </Link>
          </p>
          <p className="text-sm">
            <Link to="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;

