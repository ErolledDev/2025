import React from 'react';
import { Clock, ExternalLink, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { RecentRedirect } from '../types/types';

interface RecentRedirectsProps {
  redirects: RecentRedirect[];
  onDelete: (timestamp: number) => void;
}

export default function RecentRedirects({ redirects, onDelete }: RecentRedirectsProps) {
  if (redirects.length === 0) return null;

  const handleDelete = (timestamp: number) => {
    onDelete(timestamp);
    toast.success('Link deleted successfully');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5" />
        Recent Redirects
      </h2>
      <div className="space-y-4">
        {redirects.map((redirect) => (
          <div
            key={redirect.timestamp}
            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {redirect.metadata.title || redirect.originalUrl}
                </h3>
                <p className="text-sm text-gray-500 truncate">{redirect.redirectUrl}</p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={redirect.redirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ExternalLink className="h-5 w-5 text-gray-600" />
                </a>
                <button
                  onClick={() => handleDelete(redirect.timestamp)}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete redirect"
                >
                  <Trash2 className="h-5 w-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}