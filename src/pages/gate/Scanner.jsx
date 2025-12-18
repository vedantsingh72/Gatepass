import { useState } from 'react';
import QRScanner from '../../components/qr/QRScanner';
import { scanQRCode } from '../../services/gate.service';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/helpers';

/**
 * Scanner Page
 * QR code scanner for gate staff to validate passes
 */
const Scanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleScanSuccess = async (qrCode) => {
    try {
      setError('');
      setLoading(true);
      const response = await scanQRCode(qrCode);
      setScanResult(response.data);
    } catch (err) {
      setError(err.message || 'Invalid QR code or pass not found.');
      setScanResult(null);
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (err) => {
    console.error('Scan error:', err);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">QR Code Scanner</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scanner */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <QRScanner
            onScanSuccess={handleScanSuccess}
            onScanError={handleScanError}
          />
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Scan Result</h2>

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Validating...</p>
            </div>
          )}

          <ErrorMessage message={error} />

          {scanResult && (
            <div className="space-y-4">
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <p className="font-semibold">✓ Entry Allowed</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Pass Details:</h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Type:</strong> {scanResult.passType}
                  </p>
                  <p>
                    <strong>From:</strong> {formatDate(scanResult.fromDate)}
                  </p>
                  <p>
                    <strong>To:</strong> {formatDate(scanResult.toDate)}
                  </p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span
                      className={
                        scanResult.isUsed
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600 font-semibold'
                      }
                    >
                      {scanResult.isUsed ? 'Already Used' : 'Valid'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setScanResult(null);
                  setError('');
                }}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Scan Another
              </button>
            </div>
          )}

          {!scanResult && !loading && !error && (
            <div className="text-center py-8 text-gray-500">
              <p>Scan a QR code to validate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Scanner;

