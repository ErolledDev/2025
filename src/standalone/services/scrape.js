export async function scrapeMetadata(url) {
  try {
    const corsProxy = 'https://api.allorigins.win/raw?url=';
    const response = await fetch(`${corsProxy}${encodeURIComponent(url)}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch URL. Please use manual mode instead.');
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title = 
      doc.querySelector('meta[property="og:title"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:title"]')?.getAttribute('content') ||
      doc.querySelector('title')?.textContent ||
      'No title available';

    const description = 
      doc.querySelector('meta[property="og:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="twitter:description"]')?.getAttribute('content') ||
      doc.querySelector('meta[name="description"]')?.getAttribute('content') ||
      '';

    const image = 
      doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[property="twitter:image"]')?.getAttribute('content') ||
      doc.querySelector('meta[property="twitter:image:src"]')?.getAttribute('content') ||
      '';

    return { 
      title: title.trim(), 
      description: description.trim(), 
      image: image.trim() 
    };
  } catch (error) {
    throw new Error('Failed to fetch metadata. Please use manual mode instead.');
  }
}