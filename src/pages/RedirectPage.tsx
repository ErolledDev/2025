import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ExternalLink, AlertCircle } from 'lucide-react';
import { scrapeMetadata } from '../services/scrapeService';
import type { UrlMetadata } from '../types/types';

export default function RedirectPage() {
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<UrlMetadata | null>(null);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetUrl = params.get('u');
    const customTitle = params.get('title');
    const customDescription = params.get('des');

    if (!targetUrl) {
      navigate('/');
      return;
    }

    scrapeMetadata(targetUrl)
      .then((data) => {
        setMetadata({
          ...data,
          url: targetUrl,
          timestamp: Date.now(),
          title: customTitle || data.title,
          description: customDescription || data.description,
        });
      })
      .catch(() => {
        setError('Failed to load preview. You can still proceed to the destination.');
        // Still set basic metadata even if scraping fails
        setMetadata({
          title: customTitle || 'Visit Website',
          description: customDescription || 'No description available',
          image: '',
          url: targetUrl,
          timestamp: Date.now(),
        });
      });

    const duration = 30000;
    const interval = 10;
    const step = (interval / duration) * 100;
    let currentProgress = 0;

    const timer = setInterval(() => {
      currentProgress += step;
      if (currentProgress >= 100) {
        clearInterval(timer);
        setIsCountdownComplete(true);
        setProgress(100);
      } else {
        setProgress(currentProgress);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [location, navigate]);

  const handleRedirect = () => {
    if (metadata?.url) {
      window.location.href = metadata.url;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      {/* Top Advertisement */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden mb-4">
        <div className="bg-blue-50 px-4 py-2 text-sm text-blue-700 font-medium">
          Advertisement
        </div>
        <div className="p-4 min-h-[100px] md:min-h-[120px] flex items-center justify-center text-gray-500">
          Your Ad Content Here
        </div>
      </div>

      {/* Main Content Card */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative">
          <div 
            className="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="p-4 sm:p-6">
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-yellow-50 rounded-lg flex items-start sm:items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          )}
          
          {metadata ? (
            <>
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {metadata.title || 'Ready to Visit'}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                    {metadata.description || 'No description available'}
                  </p>
                </div>
                {metadata.image && (
                  <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0">
                    <img
                      src={metadata.image}
                      alt={metadata.title}
                      className="w-full h-full object-cover rounded-lg shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-sm text-gray-600 break-all">
                  Destination: {metadata.url}
                </p>
              </div>
            </>
          ) : (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between">
              <div className="flex items-center gap-2">
                {!isCountdownComplete && (
                  <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                )}
                <p className="text-gray-600 text-sm sm:text-base">
                  {isCountdownComplete ? 'Ready to proceed' : 'Preparing your destination...'}
                </p>
              </div>
              {isCountdownComplete && (
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    onClick={handleRedirect}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <span>Visit Website</span>
                    <ExternalLink className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full sm:w-auto px-6 py-2.5 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Advertisement */}
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden mt-4">
        <div className="bg-blue-50 px-4 py-2 text-sm text-blue-700 font-medium">
          Advertisement
        </div>
        <div className="p-4 min-h-[100px] md:min-h-[120px] flex items-center justify-center text-gray-500">
          Your Ad Content Here
        </div>
      </div>
    </div>
  );
}