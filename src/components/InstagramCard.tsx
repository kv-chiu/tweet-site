import { InstagramEmbed } from 'react-social-media-embed';
import { DeleteButton } from './DeleteButton';
import { LazyEmbed } from './LazyEmbed';

interface InstagramCardProps {
  shortcode: string;
  secret: string;
  verified: boolean;
  onDeleted: (id: string) => void;
}

export function InstagramCard({ shortcode, secret, verified, onDeleted }: InstagramCardProps) {
  return (
    <div className="embed-card">
      {verified && <DeleteButton tweetId={shortcode} secret={secret} onDeleted={onDeleted} />}
      <LazyEmbed height={450}>
        <InstagramEmbed url={`https://www.instagram.com/p/${shortcode}/`} width="100%" />
      </LazyEmbed>
      {verified && <div className="tweet-card-id">{shortcode}</div>}
    </div>
  );
}
