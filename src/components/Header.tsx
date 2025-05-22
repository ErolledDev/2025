import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <RouterLink to="/" className="flex items-center space-x-2">
            <LinkIcon className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-semibold text-gray-900">URL Redirector</span>
          </RouterLink>
          <nav>
            <RouterLink
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create Redirect
            </RouterLink>
          </nav>
        </div>
      </div>
    </header>
  );
}