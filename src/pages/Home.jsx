import { Link } from 'react-router-dom';
import GlobalHeader from '../components/common/GlobalHeader';

/**
 * Home Page
 * Landing page with registration options for all roles
 */
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <GlobalHeader />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to Aagman
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            College Gate Pass Management System
          </p>
          <Link
            to="/login"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg"
          >
            Login
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Register as
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Student Registration */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-bold mb-2">Student</h3>
                <p className="text-gray-600 mb-4">
                  Register as a student to create and manage gate passes
                </p>
                <Link
                  to="/register/student"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Department Registration */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">🏛️</div>
                <h3 className="text-xl font-bold mb-2">Department</h3>
                <p className="text-gray-600 mb-4">
                  Register as a department to approve outstation passes
                </p>
                <Link
                  to="/register/department"
                  className="inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Academic Registration */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="text-xl font-bold mb-2">Academic Office</h3>
                <p className="text-gray-600 mb-4">
                  Register as academic office to approve passes
                </p>
                <Link
                  to="/register/academic"
                  className="inline-block bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Hostel Office Registration */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">🏠</div>
                <h3 className="text-xl font-bold mb-2">Hostel Office</h3>
                <p className="text-gray-600 mb-4">
                  Register as hostel office to approve local passes
                </p>
                <Link
                  to="/register/hosteloffice"
                  className="inline-block bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>

            {/* Gate Registration */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition">
              <div className="text-center">
                <div className="text-4xl mb-4">🚪</div>
                <h3 className="text-xl font-bold mb-2">Gate</h3>
                <p className="text-gray-600 mb-4">
                  Register as a gate to scan and verify passes
                </p>
                <Link
                  to="/register/gate"
                  className="inline-block bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

