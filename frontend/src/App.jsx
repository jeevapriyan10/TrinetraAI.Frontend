import React, { useState } from 'react';
import axios from 'axios';
import { AlertTriangle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import VerificationForm from './components/VerificationForm';
import Dashboard from './components/Dashboard';
import ResultDisplay from './components/ResultDisplay';
const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
function App() {
  const [activeTab, setActiveTab] = useState('verify');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleVerification = async (text) => {
    setLoading(true);
    try {
      // Use absolute URL to backend API without proxy
      const response = await axios.post('${BACKEND}/api/verify', { text });
      setVerificationResult(response.data);
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationResult({
        error: 'Failed to verify text. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Misinformation Detection
              </h1>
            </div>
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('verify')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'verify' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Verify Text
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'dashboard' ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Dashboard
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'verify' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Verify Information Accuracy
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Submit text content to analyze for potential misinformation using advanced ML models and AI verification systems.
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <VerificationForm onSubmit={handleVerification} loading={loading} />
              <ResultDisplay result={verificationResult} loading={loading} />
            </div>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="card text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600">Advanced machine learning models trained on diverse datasets</p>
              </div>
              <div className="card text-center">
                <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Verification</h3>
                <p className="text-gray-600">Instant analysis with confidence scores and categorization</p>
              </div>
              <div className="card text-center">
                <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Insights</h3>
                <p className="text-gray-600">Crowdsourced validation and trending misinformation tracking</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Misinformation Dashboard</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Track detected misinformation by category and view community engagement.
              </p>
            </div>
            <Dashboard />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Misinformation Detection App. Built for information integrity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
