export interface SiteConfig {
  title: string;
  description: string;
  columns: number;
  batchSize: number;
  repo: string; // GitHub repo, e.g. "kv-chiu/tweet-site"
}

export type MediaType = 'tweet' | 'instagram';

export interface MediaItem {
  type: MediaType;
  id: string;
}
