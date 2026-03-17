import { Tweet } from 'react-tweet';
import '../styles/lightbox-overlay.css';

interface LightboxTweetOverlayProps {
  tweetId: string;
}

export function LightboxTweetOverlay({ tweetId }: LightboxTweetOverlayProps) {
  return (
    <div className="lightbox-tweet-overlay">
      {/* Visible tab hint */}
      <div className="lightbox-tweet-tab">Tweet</div>
      {/* Card that slides down on hover */}
      <div className="lightbox-tweet-card">
        <Tweet id={tweetId} />
      </div>
    </div>
  );
}
