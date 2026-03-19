import { useCallback, useEffect, useState } from 'react';
import { parseTweetId } from '../utils/parseTweetId';
import type { MediaItem } from '../types';

function getCustomDataUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('data');
}

async function fetchData(repo: string): Promise<MediaItem[]> {
  // Priority 1: custom data source via ?data=<url>
  const customUrl = getCustomDataUrl();
  if (customUrl) {
    const res = await fetch(customUrl);
    if (res.ok) return res.json();
    throw new Error(`Failed to fetch custom data source: ${res.status}`);
  }

  // Priority 2: GitHub raw (production)
  if (repo) {
    try {
      const url = `https://raw.githubusercontent.com/${repo}/data/public/data.json`;
      const res = await fetch(url);
      if (res.ok) return res.json();
    } catch {
      // network error, fall through to local
    }
  }

  // Priority 3: local file (dev)
  try {
    const res = await fetch('/data.json');
    const contentType = res.headers.get('content-type') ?? '';
    if (res.ok && contentType.includes('application/json')) {
      return res.json();
    }
  } catch {
    // ignore
  }

  return [];
}

function normalizeItem(item: MediaItem): MediaItem {
  if (item.type === 'tweet') {
    return { type: 'tweet', id: parseTweetId(item.id) };
  }
  return item;
}

export function useMediaItems(batchSize: number, repo: string) {
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchData(repo)
      .then((data) => setAllItems(data.map(normalizeItem)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [repo]);

  const visibleItems = allItems.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, allItems.length));
  }, [batchSize, allItems.length]);

  const removeItem = useCallback((id: string) => {
    setAllItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  return { visibleItems, hasMore, loadMore, removeItem, loading, error };
}
