import React from 'react';
import { AlertTriangle, CheckCircle, Info, Loader2, XCircle } from 'lucide-react';

const ResultDisplay = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Content</h3>
            <p className="text-gray-600">Running ML models and AI verification...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
          <p className="text-gray-600">Submit text in the form to get verification results</p>
        </div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="card">
        <div className="text-center py-12">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Analysis Failed</h3>
          <p className="text-red-600">{result.error}</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = () => {
    return result.final_decision ? (
      <AlertTriangle className="h-8 w-8 text-red-500" />
    ) : (
      <CheckCircle className="h-8 w-8 text-green-500" />
    );
  };

  const getStatusColor = () => {
    return result.final_decision
      ? 'text-red-700 bg-red-50 border-red-200'
      : 'text-green-700 bg-green-50 border-green-200';
  };

  const getConfidenceColor = (confidence) => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Verification Results</h3>

      {/* Main Result */}
      <div className={`p-4 rounded-lg border-2 mb-6 ${getStatusColor()}`}>
        <div className="flex items-center space-x-3 mb-3">
          {getStatusIcon()}
          <div>
            <h4 className="text-lg font-semibold">
              {result.final_decision ? 'Potential Misinformation Detected' : 'Content Appears Reliable'}
            </h4>
            <p className="text-sm opacity-75">
              Category: {result.category || 'Unknown'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <span className="text-sm font-medium">Confidence: </span>
            <span className={`font-bold ${getConfidenceColor(result.confidence)}`}>
              {result.confidence ? (result.confidence * 100).toFixed(1) : '0.0'}%
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        {result.ml_result && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h5 className="font-semibold text-blue-900 mb-2">ML Model Result</h5>
            <div className="text-sm text-blue-800 space-y-1">
              <p>Decision: {result.ml_result.is_misinformation ? 'Misinformation' : 'Reliable'}</p>
              <p>Confidence: {(result.ml_result.confidence * 100).toFixed(1)}%</p>
              <p>Category: {result.ml_result.category}</p>
              {result.ml_result.explanation && (
                <p className="italic">{result.ml_result.explanation}</p>
              )}
            </div>
          </div>
        )}

        {result.gemini_result && (
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h5 className="font-semibold text-purple-900 mb-2">AI Analysis Result</h5>
            <div className="text-sm text-purple-800 space-y-1">
              <p>Decision: {result.gemini_result.is_misinformation ? 'Misinformation' : 'Reliable'}</p>
              <p>Confidence: {(result.gemini_result.confidence * 100).toFixed(1)}%</p>
              <p>Category: {result.gemini_result.category}</p>
              {result.gemini_result.explanation && (
                <p className="italic">{result.gemini_result.explanation}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Analysis Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded">
        <p className="text-xs text-gray-600">
          Results are generated using machine learning models and AI analysis. Always verify important information through multiple reliable sources.
        </p>
      </div>
    </div>
  );
};

export default ResultDisplay;
