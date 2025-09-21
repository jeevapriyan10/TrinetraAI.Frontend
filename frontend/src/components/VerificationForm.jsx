import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

const VerificationForm = ({ onSubmit, loading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !loading) {
      onSubmit(text.trim());
    }
  };

  const exampleTexts = [
    "COVID-19 vaccines contain microchips that track your location.",
    "Climate change is a natural phenomenon and not caused by human activities.",
    "The 2020 US presidential election was rigged with widespread voter fraud.",
    "Drinking bleach can cure coronavirus infections."
  ];

  const handleExampleClick = (exampleText) => {
    setText(exampleText);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Submit Text for Verification
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Text to Analyze
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter the text you want to verify for misinformation..."
            rows={6}
            className="input-field resize-none"
            disabled={loading}
          />
          <p className="text-sm text-gray-500 mt-1">
            Minimum 10 characters required
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || text.trim().length < 10}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Verify Text</span>
            </>
          )}
        </button>
      </form>

      {/* Example texts */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Try these examples:
        </h4>
        <div className="space-y-2">
          {exampleTexts.map((example, index) => (
            <button
              key={index}
              onClick={() => handleExampleClick(example)}
              className="text-left w-full p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
              disabled={loading}
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VerificationForm;
