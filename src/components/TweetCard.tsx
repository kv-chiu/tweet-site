import { XEmbed } from 'react-social-media-embed';
import { DeleteButton } from './DeleteButton';
import { LazyEmbed } from './LazyEmbed';

interface TweetCardProps {
  id: string;
  secret: string;
  onDeleted: (id: string) => void;
}

export function TweetCard({ id, secret, onDeleted }: TweetCardProps) {
  return (
    <div className="tweet-card">
      {secret && <DeleteButton tweetId={id} secret={secret} onDeleted={onDeleted} />}
      <LazyEmbed height={350}>
        <XEmbed url={`https://x.com/i/status/${id}`} width="100%" />
      </LazyEmbed>
    </div>
  );
}
