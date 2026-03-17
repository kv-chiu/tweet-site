import { useCallback, useEffect, useState } from 'react';
import { parseTweetId } from '../utils/parseTweetId';
import { fetchJson } from '../utils/fetchJson';

export function useTweetIds(batchSize: number) {
  const [allIds, setAllIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJson<string[]>('/tweets.json', 'tweets.example.json')
      .then((data) => {
        setAllIds(data.map(parseTweetId));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const visibleIds = allIds.slice(0, visibleCount);
  const hasMore = visibleCount < allIds.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, allIds.length));
  }, [batchSize, allIds.length]);

  return { visibleIds, hasMore, loadMore, loading, error };
}
