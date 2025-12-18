import { Link } from 'react-router-dom';

const AcademicDashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Academic Office Dashboard</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-600 mb-4">
          Approve passes that have been approved by the department.
        </p>
        <Link
          to="/academic/pending"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
        >
          View Pending Passes
        </Link>
      </div>
    </div>
  );
};

export default AcademicDashboard;

