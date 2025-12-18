import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../../services/auth.service';
import ErrorMessage from '../../components/common/ErrorMessage';
import Loading from '../../components/common/Loading';
import GlobalHeader from '../../components/common/GlobalHeader';

/**
 * OTP Verification Page
 * Verifies student email after registration
 */
const VerifyOTP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/register/student');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);

    try {
      await verifyOTP({ email, otp });
      setSuccess('Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'Email verified! Please login.' }
        });
      }, 2000);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResending(true);

    try {
      await resendOTP({ email });
      setSuccess('OTP resent successfully! Please check your email.');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return <Loading message="Verifying..." />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <GlobalHeader />
      <div className="flex items-center justify-center py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Verify Your Email</h2>

        {location.state?.message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
            {location.state.message}
          </div>
        )}

        <ErrorMessage message={error} />
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
            {success}
          </div>
        )}

        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Verification code sent to:
          </p>
          <p className="text-sm font-medium text-gray-900">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* OTP Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter 6-Digit OTP
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError('');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl tracking-widest"
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={otp.length !== 6 || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium disabled:opacity-50"
          >
            Verify Email
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-blue-600 hover:underline text-sm disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        {/* Back to Registration */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => navigate('/register/student')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Back to Registration
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

