export interface UrlMetadata {
  title: string;
  description: string;
  image: string;
  url: string;
  timestamp: number;
}

export interface RecentRedirect {
  originalUrl: string;
  redirectUrl: string;
  metadata: UrlMetadata;
  timestamp: number;
}