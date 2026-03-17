import { TweetCard } from './TweetCard';
import '../styles/waterfall.css';

interface WaterfallViewProps {
  ids: string[];
  columns: number;
}

export function WaterfallView({ ids, columns }: WaterfallViewProps) {
  return (
    <div className="waterfall" style={{ columnCount: columns }}>
      {ids.map((id) => (
        <TweetCard key={id} id={id} />
      ))}
    </div>
  );
}
