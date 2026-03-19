import { useCallback, useEffect, useState } from 'react';
import { parseTweetId } from '../utils/parseTweetId';
import type { MediaItem } from '../types';

async function fetchData(repo: string): Promise<MediaItem[]> {
  if (repo) {
    const url = `https://raw.githubusercontent.com/${repo}/data/public/data.json`;
    const res = await fetch(url);
    if (res.ok) return res.json();
  }

  const res = await fetch('/data.json');
  const contentType = res.headers.get('content-type') ?? '';
  if (!res.ok || !contentType.includes('application/json')) {
    throw new Error('data.json not found');
  }
  return res.json();
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
