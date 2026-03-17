import type { ViewType } from '../types';
import { WaterfallView } from './WaterfallView';
import { AlbumView } from './AlbumView';
import { LoadMoreTrigger } from './LoadMoreTrigger';

interface TweetFeedProps {
  ids: string[];
  view: ViewType;
  columns: number;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function TweetFeed({ ids, view, columns, hasMore, onLoadMore }: TweetFeedProps) {
  return (
    <main className="tweet-feed">
      {view === 'waterfall' ? (
        <WaterfallView ids={ids} columns={columns} />
      ) : (
        <AlbumView ids={ids} />
      )}
      <LoadMoreTrigger onLoadMore={onLoadMore} hasMore={hasMore} />
    </main>
  );
}
