import { Tweet } from 'react-tweet';
import { DeleteButton } from './DeleteButton';
import '../styles/tweet-fallback.css';

interface TweetCardProps {
  id: string;
  secret: string;
  onDeleted: (id: string) => void;
}

function TweetFallback({ id }: { id: string }) {
  return (
    <a
      className="tweet-fallback"
      href={`https://x.com/i/status/${id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="tweet-fallback-icon">𝕏</span>
      <span className="tweet-fallback-text">View on X</span>
    </a>
  );
}

export function TweetCard({ id, secret, onDeleted }: TweetCardProps) {
  return (
    <div className="tweet-card">
      {secret && <DeleteButton tweetId={id} secret={secret} onDeleted={onDeleted} />}
      <Tweet
        id={id}
        components={{
          TweetNotFound: () => <TweetFallback id={id} />,
        }}
      />
      {secret && <div className="tweet-card-id">{id}</div>}
    </div>
  );
}
