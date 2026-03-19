import type { MediaItem } from '../types';
import { TweetCard } from './TweetCard';
import { InstagramCard } from './InstagramCard';
import '../styles/waterfall.css';

interface WaterfallViewProps {
  items: MediaItem[];
  columns: number;
  secret: string;
  onDeleted: (id: string) => void;
}

export function WaterfallView({ items, columns, secret, onDeleted }: WaterfallViewProps) {
  return (
    <div className="waterfall" style={{ columnCount: columns }}>
      {items.map((item) =>
        item.type === 'instagram' ? (
          <InstagramCard key={`ig-${item.id}`} shortcode={item.id} secret={secret} onDeleted={onDeleted} />
        ) : (
          <TweetCard key={item.id} id={item.id} secret={secret} onDeleted={onDeleted} />
        ),
      )}
    </div>
  );
}
