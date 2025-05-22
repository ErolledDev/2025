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
      
      const redirectUrl = `${window.location.origin}/u?u=${encodeURIComponent(metadata.url)}&title=${encodeURIComponent(metadata.title)}&des=${encodeURIComponent(metadata.description)}`;
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

  const handleMetadataUpdate = (updates: Partial<UrlMetadata>) => {
    if (!currentMetadata) return;

    const updatedMetadata = { ...currentMetadata, ...updates };
    setCurrentMetadata(updatedMetadata);

    setRecentRedirects((prev) => {
      const index = prev.findIndex(r => r.originalUrl === currentMetadata.url);
      if (index === -1) return prev;

      const newRedirects = [...prev];
      newRedirects[index] = {
        ...newRedirects[index],
        metadata: updatedMetadata,
        redirectUrl: `${window.location.origin}/u?u=${encodeURIComponent(updatedMetadata.url)}&title=${encodeURIComponent(updates.customTitle || updatedMetadata.title)}&des=${encodeURIComponent(updates.customDescription || updatedMetadata.description)}`,
      };
      return newRedirects;
    });
  };

  const handleDelete = (timestamp: number) => {
    setRecentRedirects((prev) => prev.filter((redirect) => redirect.timestamp !== timestamp));
  };

  const existingUrls = recentRedirects.map(redirect => redirect.originalUrl);

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">URL Redirect Generator</h1>
          <p className="text-lg text-gray-600">
            Generate shareable redirect links with customizable previews
          </p>
        </div>

        <UrlForm 
          onMetadataFetch={handleMetadataFetch} 
          isLoading={isLoading}
          existingUrls={existingUrls}
        />
        {currentMetadata && (
          <UrlPreview 
            metadata={currentMetadata} 
            onMetadataUpdate={handleMetadataUpdate}
          />
        )}
        <RecentRedirects 
          redirects={recentRedirects}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}