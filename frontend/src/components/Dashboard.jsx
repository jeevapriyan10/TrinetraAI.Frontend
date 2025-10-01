import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, TrendingUp, ThumbsUp, Loader2, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const BACKEND = 'https://trinetraai-backend.onrender.com';
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND}/api/dashboard`);
      setDashboardData(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (category, text) => {
    try {
      await axios.post(`${BACKEND}/api/upvote`, { category, text });
      // Refresh data after upvote
      fetchDashboardData();
    } catch (err) {
      console.error('Upvote error:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      health: 'bg-red-100 text-red-800 border-red-200',
      politics: 'bg-blue-100 text-blue-800 border-blue-200',
      climate: 'bg-green-100 text-green-800 border-green-200',
      general: 'bg-gray-100 text-gray-800 border-gray-200',
      unknown: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[category] || colors.unknown;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="btn-primary"
        >
          Retry
        </button>
      </div>
    );
  }

  if (dashboardData.length === 0) {
    return (
      <div className="card text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
        <p className="text-gray-600">
          Start verifying content to see misinformation trends and statistics.
        </p>
      </div>
    );
  }

  const totalDetections = dashboardData.reduce((sum, category) => sum + category.count, 0);

  return (
    <div className="space-y-8">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <BarChart3 className="h-8 w-8 text-primary-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{totalDetections}</h3>
          <p className="text-gray-600">Total Detections</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{dashboardData.length}</h3>
          <p className="text-gray-600">Categories</p>
        </div>
        <div className="card text-center">
          <ThumbsUp className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">
            {dashboardData.reduce((sum, cat) =>
              sum + cat.texts.reduce((textSum, text) => textSum + (text.upvotes || 0), 0), 0
            )}
          </h3>
          <p className="text-gray-600">Total Upvotes</p>
        </div>
      </div>

      {/* Category Overview */}
      <div className="card">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          Misinformation by Category
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dashboardData.map((category) => (
            <div
              key={category._id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category._id ? 'ring-2 ring-primary-500' : ''
              } ${getCategoryColor(category._id)}`}
              onClick={() => setSelectedCategory(
                selectedCategory === category._id ? null : category._id
              )}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold capitalize">
                  {category._id || 'Unknown'}
                </h4>
                <span className="text-sm font-bold">
                  {category.count}
                </span>
              </div>
              <p className="text-sm opacity-75">
                {category.count} detection{category.count !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed View */}
      {selectedCategory && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Misinformation
          </h3>
          <div className="space-y-4">
            {dashboardData
              .find(cat => cat._id === selectedCategory)
              ?.texts.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border">
                  <div className="flex justify-between items-start mb-3">
                    <p className="text-gray-800 flex-1 mr-4">&quot;{item.text}&quot;</p>
                    <button
                      onClick={() => handleUpvote(selectedCategory, item.text)}
                      className="flex items-center space-x-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full text-sm transition-colors"
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span>{item.upvotes || 0}</span>
                    </button>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
