import { useMemo, useSyncExternalStore } from 'react';
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

function getResponsiveColumns(maxColumns: number): number {
  const w = window.innerWidth;
  if (w <= 768) return 1;
  if (w <= 1024) return Math.min(2, maxColumns);
  return maxColumns;
}

function subscribe(cb: () => void) {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
}

function useResponsiveColumns(maxColumns: number): number {
  return useSyncExternalStore(subscribe, () => getResponsiveColumns(maxColumns));
}

function useColumns(items: MediaItem[], columns: number): MediaItem[][] {
  return useMemo(() => {
    const cols: MediaItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => {
      cols[i % columns].push(item);
    });
    return cols;
  }, [items, columns]);
}

function renderCard(item: MediaItem, secret: string, onDeleted: (id: string) => void) {
  return item.type === 'instagram' ? (
    <InstagramCard key={`ig-${item.id}`} shortcode={item.id} secret={secret} onDeleted={onDeleted} />
  ) : (
    <TweetCard key={item.id} id={item.id} secret={secret} onDeleted={onDeleted} />
  );
}

export function WaterfallView({ items, columns: maxColumns, secret, onDeleted }: WaterfallViewProps) {
  const columns = useResponsiveColumns(maxColumns);
  const cols = useColumns(items, columns);

  return (
    <div className="waterfall">
      {cols.map((colItems, colIndex) => (
        <div className="waterfall-column" key={colIndex}>
          {colItems.map((item) => renderCard(item, secret, onDeleted))}
        </div>
      ))}
    </div>
  );
}
