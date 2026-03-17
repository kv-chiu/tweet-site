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
  secret: string;
  onDeleted: (tweetId: string) => void;
}

export function TweetFeed({ ids, view, columns, hasMore, onLoadMore, secret, onDeleted }: TweetFeedProps) {
  return (
    <main className="tweet-feed">
      {view === 'waterfall' ? (
        <WaterfallView ids={ids} columns={columns} secret={secret} onDeleted={onDeleted} />
      ) : (
        <AlbumView ids={ids} secret={secret} onDeleted={onDeleted} />
      )}
      <LoadMoreTrigger onLoadMore={onLoadMore} hasMore={hasMore} />
    </main>
  );
}
