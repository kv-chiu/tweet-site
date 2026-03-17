export interface SiteConfig {
  title: string;
  description: string;
  defaultView: ViewType;
  columns: number;
  batchSize: number;
}

export type ViewType = 'waterfall' | 'album';
