import { useEffect, useState } from 'react';
import type { SiteConfig } from '../types';
import { fetchJson } from '../utils/fetchJson';

const defaultConfig: SiteConfig = {
  title: 'Tweet Collection',
  description: '',
  columns: 3,
  batchSize: 10,
  repo: '',
};

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<Partial<SiteConfig>>('/site.json', 'site.example.json')
      .then((data) => setConfig({ ...defaultConfig, ...data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading, error };
}
