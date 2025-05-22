import React, { useState } from 'react';
import { Copy, ExternalLink, Image as ImageIcon, Edit2, Check, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import type { UrlMetadata } from '../types/types';

interface UrlPreviewProps {
  metadata: UrlMetadata;
  onMetadataUpdate: (updates: Partial<UrlMetadata>) => void;
}

export default function UrlPreview({ metadata, onMetadataUpdate }: UrlPreviewProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempTitle, setTempTitle] = useState(metadata.customTitle || metadata.title);
  const [tempDescription, setTempDescription] = useState(metadata.customDescription || metadata.description);
  const [isCopying, setIsCopying] = useState(false);

  const redirectUrl = `${window.location.origin}/u?u=${encodeURIComponent(metadata.url)}&title=${encodeURIComponent(metadata.customTitle || metadata.title)}&des=${encodeURIComponent(metadata.customDescription || metadata.description)}`;

  const copyToClipboard = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(redirectUrl);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopying(false), 1000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
      setIsCopying(false);
    }
  };

  const handleTitleSave = () => {
    onMetadataUpdate({ customTitle: tempTitle });
    setIsEditingTitle(false);
    toast.success('Title updated successfully');
  };

  const handleDescriptionSave = () => {
    onMetadataUpdate({ customDescription: tempDescription });
    setIsEditingDescription(false);
    toast.success('Description updated successfully');
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <div className="flex items-start gap-2 mb-2">
                {isEditingTitle ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={tempTitle}
                      onChange={(e) => setTempTitle(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      autoFocus
                    />
                    <button
                      onClick={handleTitleSave}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Check className="h-5 w-5 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {metadata.customTitle || metadata.title || 'No title available'}
                    </h2>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      title="Edit title"
                    >
                      <Edit2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </>
                )}
              </div>
              <div className="flex items-start gap-2 mb-4">
                {isEditingDescription ? (
                  <div className="flex-1 flex gap-2">
                    <textarea
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="flex-1 px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      autoFocus
                    />
                    <button
                      onClick={handleDescriptionSave}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Check className="h-5 w-5 text-green-600" />
                    </button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-600 line-clamp-3">
                      {metadata.customDescription || metadata.description || 'No description available'}
                    </p>
                    <button
                      onClick={() => setIsEditingDescription(true)}
                      className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                      title="Edit description"
                    >
                      <Edit2 className="h-4 w-4 text-gray-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {metadata.image ? (
              <div className="w-32 h-32 flex-shrink-0">
                <img
                  src={metadata.image}
                  alt={metadata.customTitle || metadata.title}
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
                  className="p-2 hover:bg-gray-200 rounded-lg transition-all"
                  title="Copy redirect URL"
                  disabled={isCopying}
                >
                  {isCopying ? (
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                  ) : (
                    <Copy className="h-5 w-5 text-gray-600" />
                  )}
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