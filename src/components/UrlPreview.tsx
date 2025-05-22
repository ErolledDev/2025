import React from 'react';
import { Copy, ExternalLink, Image as ImageIcon } from 'lucide-react';
import type { UrlMetadata } from '../types/types';

interface UrlPreviewProps {
  metadata: UrlMetadata;
}

export default function UrlPreview({ metadata }: UrlPreviewProps) {
  const redirectUrl = `${window.location.origin}/u?=${encodeURIComponent(metadata.url)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(redirectUrl);
      alert('Redirect URL copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">{metadata.title || 'No title available'}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{metadata.description || 'No description available'}</p>
            </div>
            {metadata.image ? (
              <div className="w-32 h-32 flex-shrink-0">
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
            ) : (
              <div className="w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <code className="text-sm text-gray-600 flex-1 overflow-x-auto">{redirectUrl}</code>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={copyToClipboard}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Copy redirect URL"
                >
                  <Copy className="h-5 w-5 text-gray-600" />
                </button>
                <a
                  href={redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                  title="Open redirect URL"
                >
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}