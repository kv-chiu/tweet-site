import { TweetCard } from './TweetCard';
import '../styles/waterfall.css';

interface WaterfallViewProps {
  ids: string[];
  columns: number;
  secret: string;
  onDeleted: (tweetId: string) => void;
}

export function WaterfallView({ ids, columns, secret, onDeleted }: WaterfallViewProps) {
  return (
    <div className="waterfall" style={{ columnCount: columns }}>
      {ids.map((id) => (
        <TweetCard key={id} id={id} secret={secret} onDeleted={onDeleted} />
      ))}
    </div>
  );
}
