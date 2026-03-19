import { InstagramEmbed } from 'react-social-media-embed';
import { DeleteButton } from './DeleteButton';
import { LazyEmbed } from './LazyEmbed';

interface InstagramCardProps {
  shortcode: string;
  secret: string;
  onDeleted: (id: string) => void;
}

export function InstagramCard({ shortcode, secret, onDeleted }: InstagramCardProps) {
  return (
    <div className="embed-card">
      {secret && <DeleteButton tweetId={shortcode} secret={secret} onDeleted={onDeleted} />}
      <LazyEmbed height={450}>
        <InstagramEmbed url={`https://www.instagram.com/p/${shortcode}/`} width="100%" />
      </LazyEmbed>
    </div>
  );
}
