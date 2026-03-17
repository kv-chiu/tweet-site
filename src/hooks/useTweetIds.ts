import { useCallback, useEffect, useState } from 'react';
import { parseTweetId } from '../utils/parseTweetId';

async function fetchTweets(repo: string): Promise<string[]> {
  // If repo is configured, fetch from GitHub raw (avoids triggering Vercel rebuild)
  if (repo) {
    const url = `https://raw.githubusercontent.com/${repo}/main/public/tweets.json`;
    const res = await fetch(url);
    if (res.ok) return res.json();
  }

  // Fallback: local file (for dev or when repo is not configured)
  const res = await fetch('/tweets.json');
  if (!res.ok) throw new Error('tweets.json not found');
  return res.json();
}

export function useTweetIds(batchSize: number, repo: string) {
  const [allIds, setAllIds] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(batchSize);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTweets(repo)
      .then((data) => {
        setAllIds(data.map(parseTweetId));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [repo]);

  const visibleIds = allIds.slice(0, visibleCount);
  const hasMore = visibleCount < allIds.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + batchSize, allIds.length));
  }, [batchSize, allIds.length]);

  const removeId = useCallback((id: string) => {
    setAllIds((prev) => prev.filter((t) => t !== id));
  }, []);

  return { visibleIds, hasMore, loadMore, removeId, loading, error };
}
