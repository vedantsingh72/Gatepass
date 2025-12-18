import { Link } from 'react-router-dom';

/**
 * Hostel Office Dashboard
 * Main dashboard for hostel office staff
 */
const HostelDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hostel Office Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          View and approve pending local passes.
        </p>
        <Link
          to="/hostel/pending"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          View Pending Local Passes
        </Link>
      </div>
    </div>
  );
};

export default HostelDashboard;

