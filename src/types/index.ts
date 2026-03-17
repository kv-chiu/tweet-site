export interface SiteConfig {
  title: string;
  description: string;
  defaultView: ViewType;
  columns: number;
  batchSize: number;
  repo: string; // GitHub repo, e.g. "kv-chiu/tweet-site"
}

export type ViewType = 'waterfall' | 'album';
