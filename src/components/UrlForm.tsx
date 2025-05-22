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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Check if URL already exists
    if (existingUrls.includes(url)) {
      setError('This URL has already been generated. Please check your recent redirects.');
      return;
    }

    setError(null);
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
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Link className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to redirect (e.g., https://example.com)"
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
              disabled={isLoading}
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Fetching...</span>
              </>
            ) : (
              'Generate Redirect'
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