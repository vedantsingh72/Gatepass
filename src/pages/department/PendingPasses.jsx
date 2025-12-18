import { useState, useEffect } from 'react';
import { getPendingPasses, approvePass } from '../../services/department.service';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate, getPassTypeLabel } from '../../utils/helpers';

/**
 * Pending Passes Page
 * Shows pending outstation passes for department approval
 */
const PendingPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPasses();
  }, []);

  const fetchPasses = async () => {
    try {
      setLoading(true);
      const response = await getPendingPasses();
      setPasses(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load pending passes.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (passId) => {
    try {
      setProcessing(passId);
      await approvePass(passId);
      await fetchPasses(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to approve pass.');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return <Loading message="Loading pending passes..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Pending Outstation Passes</h1>

      <ErrorMessage message={error} />

      {passes.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No pending passes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {passes.map((pass) => (
            <div
              key={pass._id}
              className="bg-white p-6 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">
                    {pass.student?.name || 'Unknown Student'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Roll No: {pass.student?.rollNo || 'N/A'}
                  </p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                  PENDING
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">
                  <strong>Type:</strong> {getPassTypeLabel(pass.passType)}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Reason:</strong> {pass.reason}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>From:</strong> {formatDate(pass.fromDate)} |{' '}
                  <strong>To:</strong> {formatDate(pass.toDate)}
                </p>
              </div>

              <button
                onClick={() => handleApprove(pass._id)}
                disabled={processing === pass._id}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
              >
                {processing === pass._id ? 'Processing...' : 'Approve'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingPasses;

