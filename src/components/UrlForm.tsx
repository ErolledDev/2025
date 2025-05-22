import React, { useState } from 'react';
import { Link, AlertCircle, Loader2 } from 'lucide-react';
import { scrapeMetadata } from '../services/scrapeService';
import type { UrlMetadata } from '../types/types';

interface UrlFormProps {
  onMetadataFetch: (metadata: UrlMetadata) => void;
  isLoading: boolean;
  existingUrls: string[];
}

export default function UrlForm({ onMetadataFetch, isLoading, existingUrls }: UrlFormProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualTitle, setManualTitle] = useState('');
  const [manualDescription, setManualDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Check if URL already exists
    if (existingUrls.includes(url)) {
      setError('This URL has already been generated. Please check your recent redirects.');
      return;
    }

    setError(null);

    if (isManualMode) {
      // Use manual input
      onMetadataFetch({
        url,
        title: manualTitle || 'No title',
        description: manualDescription || 'No description',
        image: '',
        timestamp: Date.now(),
      });
    } else {
      try {
        const metadata = await scrapeMetadata(url);
        onMetadataFetch({
          ...metadata,
          url,
          timestamp: Date.now(),
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full space-y-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsManualMode(!isManualMode)}
            className={`text-sm text-blue-600 hover:text-blue-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
          >
            {isManualMode ? 'Switch to Auto Mode' : 'Switch to Manual Mode'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Link className={`h-5 w-5 ${isLoading ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to redirect (e.g., https://example.com)"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                isLoading ? 'bg-gray-50' : ''
              }`}
              required
              disabled={isLoading}
            />
          </div>

          {isManualMode && (
            <>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Enter custom title"
                className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  isLoading ? 'bg-gray-50' : ''
                }`}
                disabled={isLoading}
              />
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Enter custom description"
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                  isLoading ? 'bg-gray-50' : ''
                }`}
                disabled={isLoading}
              />
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px] group"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Link className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>Generate Redirect</span>
              </>
            )}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}