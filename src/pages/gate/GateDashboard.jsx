import { Link } from 'react-router-dom';

/**
 * Gate Dashboard
 * Main dashboard for gate staff
 */
const GateDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gate Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          Scan QR codes to validate student passes.
        </p>
        <Link
          to="/gate/scanner"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          Open QR Scanner
        </Link>
      </div>
    </div>
  );
};

export default GateDashboard;

