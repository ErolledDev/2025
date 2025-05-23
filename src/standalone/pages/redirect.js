export function renderRedirectPage(container) {
  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get('u');
  const title = params.get('title');
  const description = params.get('des');

  if (!targetUrl) {
    window.location.href = '/';
    return;
  }

  const template = `
    <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
      <div class="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="relative">
          <div id="progress-bar" class="absolute top-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-out" style="width: 0%"></div>
        </div>
        
        <div class="p-4 sm:p-6">
          <div class="flex flex-col sm:flex-row items-start gap-4 sm:gap-6 mb-6">
            <div class="flex-1 min-w-0">
              <h1 class="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 line-clamp-2">
                ${title || 'Ready to Visit'}
              </h1>
              <p class="text-sm sm:text-base text-gray-600 line-clamp-3">
                ${description || 'No description available'}
              </p>
            </div>
          </div>
          
          <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
            <p class="text-sm text-gray-600 break-all">
              Destination: ${targetUrl}
            </p>
          </div>
          
          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-0 sm:justify-between">
              <div class="flex items-center gap-2">
                <div id="loading-indicator" class="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
                <p id="status-text" class="text-gray-600 text-sm sm:text-base">
                  Preparing your destination...
                </p>
              </div>
              <div id="action-buttons" class="hidden flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onclick="window.location.href='${targetUrl}'"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span>Visit Website</span>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </button>
                <button
                  onclick="window.location.href='/'"
                  class="w-full sm:w-auto px-6 py-2.5 text-gray-600 hover:text-gray-900 transition-colors border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = template;

  const progressBar = document.getElementById('progress-bar');
  const loadingIndicator = document.getElementById('loading-indicator');
  const statusText = document.getElementById('status-text');
  const actionButtons = document.getElementById('action-buttons');

  let progress = 0;
  const interval = setInterval(() => {
    progress += 1;
    progressBar.style.width = `${progress}%`;

    if (progress >= 100) {
      clearInterval(interval);
      loadingIndicator.style.display = 'none';
      statusText.textContent = 'Ready to proceed';
      actionButtons.classList.remove('hidden');
      actionButtons.classList.add('flex');
    }
  }, 30);
}