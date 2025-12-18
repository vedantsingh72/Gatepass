import { useState, useEffect } from 'react';
import { getStudentLeaves } from '../../services/department.service';
import { DEPARTMENTS } from '../../utils/constants';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';

/**
 * Department Student Leaves Dashboard
 * Shows student-wise leave statistics for the department
 */
const StudentLeaves = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudentLeaves();
  }, []);

  const fetchStudentLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getStudentLeaves();
      setStudents(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load student leave statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="Loading student leave statistics..." />;
  }

  // Calculate summary statistics
  const totalStudents = students.length;
  const totalLeaves = students.reduce((sum, s) => sum + (s.totalLeaves || 0), 0);
  const flaggedStudents = students.filter(s => s.isFlagged).length;
  const avgLeaves = totalStudents > 0 ? (totalLeaves / totalStudents).toFixed(2) : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Student Leave Statistics</h1>

      <ErrorMessage message={error} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Total Students</h3>
          <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Total Leaves</h3>
          <p className="text-2xl font-bold text-blue-600">{totalLeaves}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Average Leaves</h3>
          <p className="text-2xl font-bold text-green-600">{avgLeaves}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-sm text-gray-600 mb-1">Flagged Students</h3>
          <p className="text-2xl font-bold text-red-600">{flaggedStudents}</p>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Leaves
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Out of Station
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No student leave data available
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student.studentId}
                    className={student.isFlagged ? 'bg-red-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.rollNo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.year ? `${student.year}st Year` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {student.totalLeaves || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.outOfStation || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.local || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.isFlagged ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                          ⚠ Flagged
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentLeaves;

