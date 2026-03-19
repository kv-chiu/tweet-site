import type { MediaItem } from '../types';
import { WaterfallView } from './WaterfallView';
import { LoadMoreTrigger } from './LoadMoreTrigger';

interface TweetFeedProps {
  items: MediaItem[];
  columns: number;
  hasMore: boolean;
  onLoadMore: () => void;
  secret: string;
  verified: boolean;
  onDeleted: (id: string) => void;
}

export function TweetFeed({ items, columns, hasMore, onLoadMore, secret, verified, onDeleted }: TweetFeedProps) {
  return (
    <main className="tweet-feed">
      <WaterfallView items={items} columns={columns} secret={secret} verified={verified} onDeleted={onDeleted} />
      <LoadMoreTrigger onLoadMore={onLoadMore} hasMore={hasMore} />
    </main>
  );
}
