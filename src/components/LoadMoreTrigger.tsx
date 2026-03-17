import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface LoadMoreTriggerProps {
  onLoadMore: () => void;
  hasMore: boolean;
}

export function LoadMoreTrigger({ onLoadMore, hasMore }: LoadMoreTriggerProps) {
  const ref = useIntersectionObserver(onLoadMore, hasMore);

  if (!hasMore) return null;

  return (
    <div ref={ref} className="load-more-trigger">
      <span>Loading more...</span>
    </div>
  );
}
