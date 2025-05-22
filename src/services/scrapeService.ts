import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMetadata(url: string): Promise<{
  title: string;
  description: string;
  image: string;
}> {
  try {
    // Try direct fetch first
    try {
      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      return extractMetadata($);
    } catch (directError) {
      // If direct fetch fails, try with CORS proxy
      const corsProxy = 'https://api.allorigins.win/raw?url=';
      const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`, {
        timeout: 10000
      });
      
      const html = response.data;
      const $ = cheerio.load(html);
      return extractMetadata($);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again or use manual mode.');
      }
      if (error.response) {
        throw new Error('Failed to fetch URL. Please use manual mode instead.');
      }
      if (error.request) {
        throw new Error('Network error. Please check your connection or use manual mode.');
      }
    }
    throw new Error('Failed to fetch metadata. Please use manual mode instead.');
  }
}

function extractMetadata($: cheerio.CheerioAPI) {
  const title = 
    $('meta[property="og:title"]').attr('content') ||
    $('meta[name="twitter:title"]').attr('content') ||
    $('title').text() ||
    'No title available';

  const description = 
    $('meta[property="og:description"]').attr('content') ||
    $('meta[name="twitter:description"]').attr('content') ||
    $('meta[name="description"]').attr('content') ||
    '';

  const image = 
    $('meta[property="og:image"]').attr('content') ||
    $('meta[property="twitter:image"]').attr('content') ||
    $('meta[property="twitter:image:src"]').attr('content') ||
    '';

  return { 
    title: title.trim(), 
    description: description.trim(), 
    image: image.trim() 
  };
}