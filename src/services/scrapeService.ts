import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeMetadata(url: string): Promise<{
  title: string;
  description: string;
  image: string;
}> {
  try {
    // Use corsproxy.io instead of allorigins
    const corsProxy = 'https://corsproxy.io/?';
    const response = await axios.get(`${corsProxy}${encodeURIComponent(url)}`, {
      timeout: 10000, // 10 second timeout
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // More robust metadata extraction
    const title = 
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      url;

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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      if (error.response) {
        throw new Error(`Failed to fetch URL (${error.response.status})`);
      }
      if (error.request) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    throw new Error('Failed to fetch metadata. Please try again.');
  }
}