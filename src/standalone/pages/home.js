import { scrapeMetadata } from '../services/scrape.js';
import { showToast } from '../utils/toast.js';

export function renderHomePage(container) {
  let currentMetadata = null;
  let recentRedirects = JSON.parse(localStorage.getItem('recentRedirects') || '[]');

  const template = `
    <div class="min-h-screen flex flex-col">
      <header class="bg-white shadow-sm">
        <div class="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between">
            <a href="/" class="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
              <span class="text-xl font-semibold text-gray-900">URL Redirector</span>
            </a>
            <nav>
              <a href="/" class="text-gray-600 hover:text-gray-900 transition-colors">Create Redirect</a>
            </nav>
          </div>
        </div>
      </header>

      <main class="flex-grow bg-gray-50">
        <div class="py-12 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="text-center mb-12">
              <h1 class="text-4xl font-bold text-gray-900 mb-4">URL Redirect Generator</h1>
              <p class="text-lg text-gray-600">Generate shareable redirect links with customizable previews</p>
            </div>

            <div class="w-full max-w-2xl mx-auto">
              <form id="urlForm" class="w-full space-y-4">
                <div class="flex justify-end">
                  <button type="button" id="toggleMode" class="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                    Switch to Manual Mode
                  </button>
                </div>

                <div class="flex flex-col gap-4" id="formFields">
                  <div class="relative">
                    <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <input
                      type="url"
                      id="urlInput"
                      placeholder="Enter URL to redirect (e.g., https://example.com)"
                      class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  class="relative w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 min-w-[160px] group"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  <span class="font-medium">Generate Redirect</span>
                </button>
              </form>
            </div>

            <div id="preview"></div>
            <div id="recentRedirects"></div>
          </div>
        </div>
      </main>

      <footer class="bg-white border-t border-gray-200">
        <div class="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center">
            <p class="text-sm text-gray-500">© ${new Date().getFullYear()} URL Redirector. All rights reserved.</p>
            <div class="flex items-center space-x-6">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="text-gray-400 hover:text-gray-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `;

  container.innerHTML = template;

  const form = document.getElementById('urlForm');
  const toggleMode = document.getElementById('toggleMode');
  const formFields = document.getElementById('formFields');
  let isManualMode = false;

  toggleMode.addEventListener('click', () => {
    isManualMode = !isManualMode;
    toggleMode.textContent = isManualMode ? 'Switch to Auto Mode' : 'Switch to Manual Mode';
    
    if (isManualMode) {
      formFields.innerHTML += `
        <input
          type="text"
          id="titleInput"
          placeholder="Enter custom title"
          class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
        />
        <textarea
          id="descriptionInput"
          placeholder="Enter custom description"
          rows="3"
          class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
        ></textarea>
      `;
    } else {
      const titleInput = document.getElementById('titleInput');
      const descriptionInput = document.getElementById('descriptionInput');
      if (titleInput) titleInput.remove();
      if (descriptionInput) descriptionInput.remove();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value;

    if (recentRedirects.some(r => r.originalUrl === url)) {
      showToast('This URL has already been generated. Please check your recent redirects.', 'error');
      return;
    }

    try {
      let metadata;
      if (isManualMode) {
        const titleInput = document.getElementById('titleInput');
        const descriptionInput = document.getElementById('descriptionInput');
        metadata = {
          url,
          title: titleInput.value || 'No title',
          description: descriptionInput.value || 'No description',
          image: '',
          timestamp: Date.now()
        };
      } else {
        metadata = await scrapeMetadata(url);
        metadata.url = url;
        metadata.timestamp = Date.now();
      }

      currentMetadata = metadata;
      renderPreview(metadata);
      
      const redirectUrl = `${window.location.origin}/u?u=${encodeURIComponent(url)}&title=${encodeURIComponent(metadata.title)}&des=${encodeURIComponent(metadata.description)}`;
      
      recentRedirects = [{
        originalUrl: url,
        redirectUrl,
        metadata,
        timestamp: Date.now()
      }, ...recentRedirects.slice(0, 9)];
      
      localStorage.setItem('recentRedirects', JSON.stringify(recentRedirects));
      renderRecentRedirects();
      
      showToast('Link generated successfully!', 'success');
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  function renderPreview(metadata) {
    const preview = document.getElementById('preview');
    preview.innerHTML = `
      <div class="w-full max-w-2xl mx-auto mt-8 animate-fadeIn">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="p-6">
            <div class="flex items-start gap-6">
              <div class="flex-1">
                <div class="flex items-start gap-2 mb-2">
                  <h2 class="text-xl font-semibold text-gray-900">${metadata.title || 'No title available'}</h2>
                </div>
                <p class="text-gray-600 line-clamp-3">${metadata.description || 'No description available'}</p>
              </div>
              ${metadata.image ? `
                <div class="w-32 h-32 flex-shrink-0">
                  <img
                    src="${metadata.image}"
                    alt="${metadata.title}"
                    class="w-full h-full object-cover rounded-lg shadow-sm"
                    onerror="this.style.display='none'"
                  />
                </div>
              ` : ''}
            </div>
            
            <div class="mt-6 pt-6 border-t border-gray-100">
              <div class="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                <code class="text-sm text-gray-600 flex-1 overflow-x-auto">${window.location.origin}/u?u=${encodeURIComponent(metadata.url)}&title=${encodeURIComponent(metadata.title)}&des=${encodeURIComponent(metadata.description)}</code>
                <div class="flex gap-2 ml-4">
                  <button
                    onclick="navigator.clipboard.writeText(this.parentElement.previousElementSibling.textContent).then(() => showToast('Link copied to clipboard!', 'success'))"
                    class="p-2 hover:bg-gray-200 rounded-lg transition-all"
                    title="Copy redirect URL"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                  </button>
                  <a
                    href="${window.location.origin}/u?u=${encodeURIComponent(metadata.url)}&title=${encodeURIComponent(metadata.title)}&des=${encodeURIComponent(metadata.description)}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="Open redirect URL"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderRecentRedirects() {
    const container = document.getElementById('recentRedirects');
    if (recentRedirects.length === 0) {
      container.innerHTML = '';
      return;
    }

    container.innerHTML = `
      <div class="w-full max-w-2xl mx-auto mt-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          Recent Redirects
        </h2>
        <div class="space-y-4">
          ${recentRedirects.map(redirect => `
            <div class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow group">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-gray-900 truncate">
                    ${redirect.metadata.title || redirect.originalUrl}
                  </h3>
                  <p class="text-sm text-gray-500 truncate">${redirect.redirectUrl}</p>
                </div>
                <div class="flex items-center gap-2">
                  <a
                    href="${redirect.redirectUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                  </a>
                  <button
                    onclick="deleteRedirect(${redirect.timestamp})"
                    class="p-2 hover:bg-red-100 rounded-lg transition-colors"
                    title="Delete redirect"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  window.deleteRedirect = (timestamp) => {
    recentRedirects = recentRedirects.filter(r => r.timestamp !== timestamp);
    localStorage.setItem('recentRedirects', JSON.stringify(recentRedirects));
    renderRecentRedirects();
    showToast('Link deleted successfully', 'success');
  };

  renderRecentRedirects();
}