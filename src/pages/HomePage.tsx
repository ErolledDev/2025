import React, { useState, useEffect } from 'react';
import UrlForm from '../components/UrlForm';
import UrlPreview from '../components/UrlPreview';
import RecentRedirects from '../components/RecentRedirects';
import type { UrlMetadata, RecentRedirect } from '../types/types';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentMetadata, setCurrentMetadata] = useState<UrlMetadata | null>(null);
  const [recentRedirects, setRecentRedirects] = useState<RecentRedirect[]>(() => {
    const saved = localStorage.getItem('recentRedirects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentRedirects', JSON.stringify(recentRedirects));
  }, [recentRedirects]);

  const handleMetadataFetch = async (metadata: UrlMetadata) => {
    setIsLoading(true);
    try {
      setCurrentMetadata(metadata);
      
      const redirectUrl = `${window.location.origin}/u?=${encodeURIComponent(metadata.url)}`;
      const newRedirect: RecentRedirect = {
        originalUrl: metadata.url,
        redirectUrl,
        metadata,
        timestamp: Date.now(),
      };

      setRecentRedirects((prev) => [newRedirect, ...prev.slice(0, 9)]);
    } finally {
      setIsLoading(false);
    }
  };

  const existingUrls = recentRedirects.map(redirect => redirect.originalUrl);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">URL Redirect Generator</h1>
          <p className="text-lg text-gray-600">
            Generate shareable redirect links with rich previews
          </p>
        </div>

        <UrlForm 
          onMetadataFetch={handleMetadataFetch} 
          isLoading={isLoading}
          existingUrls={existingUrls}
        />
        {currentMetadata && <UrlPreview metadata={currentMetadata} />}
        <RecentRedirects redirects={recentRedirects} />
      </div>
    </div>
  );
}