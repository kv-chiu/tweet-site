import { Tweet } from 'react-tweet';
import { DeleteButton } from './DeleteButton';

interface TweetCardProps {
  id: string;
  secret: string;
  onDeleted: (tweetId: string) => void;
}

export function TweetCard({ id, secret, onDeleted }: TweetCardProps) {
  return (
    <div className="tweet-card">
      {secret && <DeleteButton tweetId={id} secret={secret} onDeleted={onDeleted} />}
      <Tweet id={id} />
    </div>
  );
}
