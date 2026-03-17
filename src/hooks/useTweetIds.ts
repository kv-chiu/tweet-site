import { useCallback, useEffect, useState } from 'react';
import { parseTweetId } from '../utils/parseTweetId';
import { fetchJson } from '../utils/fetchJson';

async function fetchTweets(repo: string): Promise<string[]> {
  // If repo is configured, fetch from GitHub raw (avoids triggering Vercel rebuild)
  if (repo) {
    const url = `https://raw.githubusercontent.com/${repo}/main/public/tweets.json`;
    const res = await fetch(url);
    if (res.ok) return res.json();
    // Fall through to local if GitHub fetch fails
  }

  return fetchJson<string[]>('/tweets.json', 'tweets.example.json');
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

  return { visibleIds, hasMore, loadMore, loading, error };
}
