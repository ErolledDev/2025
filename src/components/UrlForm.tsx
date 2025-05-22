import React, { useState } from 'react';
import { Link, AlertCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (existingUrls.includes(url)) {
      setError('This URL has already been generated. Please check your recent redirects.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    if (isManualMode) {
      try {
        onMetadataFetch({
          url,
          title: manualTitle || 'No title',
          description: manualDescription || 'No description',
          image: '',
          timestamp: Date.now(),
        });
        toast.success('Link generated successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      try {
        const metadata = await scrapeMetadata(url);
        onMetadataFetch({
          ...metadata,
          url,
          timestamp: Date.now(),
        });
        toast.success('Link generated successfully!');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
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
            className={`text-sm text-blue-600 hover:text-blue-700 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isManualMode ? 'Switch to Auto Mode' : 'Switch to Manual Mode'}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Link className={`h-5 w-5 ${isSubmitting ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
            </div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL to redirect (e.g., https://example.com)"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                isSubmitting ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300`}
              required
              disabled={isSubmitting}
            />
            {isSubmitting && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-100 to-transparent animate-shimmer opacity-50" />
            )}
          </div>

          {isManualMode && (
            <>
              <input
                type="text"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
                placeholder="Enter custom title"
                className={`w-full px-4 py-3 rounded-lg border ${
                  isSubmitting ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300`}
                disabled={isSubmitting}
              />
              <textarea
                value={manualDescription}
                onChange={(e) => setManualDescription(e.target.value)}
                placeholder="Enter custom description"
                rows={3}
                className={`w-full px-4 py-3 rounded-lg border ${
                  isSubmitting ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
                } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300`}
                disabled={isSubmitting}
              />
            </>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[160px] group overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-blue-400/50 via-blue-300/50 to-blue-400/50 ${
              isSubmitting ? 'animate-shimmer-fast opacity-100' : 'opacity-0'
            }`} />
            <div className="relative flex items-center justify-center gap-2 w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="animate-pulse-fast font-medium">Generating...</span>
                </>
              ) : (
                <>
                  <Link className="h-5 w-5 transition-transform group-hover:scale-110 duration-300" />
                  <span className="font-medium group-hover:scale-105 transition-transform duration-300">Generate Redirect</span>
                </>
              )}
            </div>
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