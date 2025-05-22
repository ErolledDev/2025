export interface UrlMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  timestamp: number;
  customTitle?: string;
  customDescription?: string;
}

export interface RecentRedirect {
  originalUrl: string;
  redirectUrl: string;
  metadata: UrlMetadata;
  timestamp: number;
}