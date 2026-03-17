import { useCallback, useEffect, useRef, useState } from 'react';
import Lightbox, { type Slide } from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { AlbumCard } from './AlbumCard';
import { LightboxTweetOverlay } from './LightboxTweetOverlay';
import '../styles/album.css';

interface MediaItem {
  src: string;
  alt: string;
  tweetId: string;
}

interface AlbumViewProps {
  ids: string[];
}

/**
 * Fetch tweet data via react-tweet's proxy API (same one the <Tweet> component uses).
 * Extract photo URLs from the response.
 */
async function fetchTweetMedia(id: string): Promise<MediaItem[]> {
  try {
    const res = await fetch(
      `https://react-tweet.vercel.app/api/tweet/${id}`,
    );
    if (!res.ok) return [];
    const { data } = await res.json();
    if (!data) return [];

    // Extract from photos array (primary source)
    const photos: { url: string }[] = data.photos ?? [];
    if (photos.length > 0) {
      return photos.map((photo) => ({
        src: photo.url,
        alt: `Photo from tweet ${id}`,
        tweetId: id,
      }));
    }

    // Fallback: extract from mediaDetails
    const mediaDetails: { type: string; media_url_https: string }[] =
      data.mediaDetails ?? [];
    return mediaDetails
      .filter((m) => m.type === 'photo')
      .map((m) => ({
        src: m.media_url_https,
        alt: `Photo from tweet ${id}`,
        tweetId: id,
      }));
  } catch {
    return [];
  }
}

export function AlbumView({ ids }: AlbumViewProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const fetchedIdsRef = useRef(new Set<string>());

  useEffect(() => {
    const newIds = ids.filter((id) => !fetchedIdsRef.current.has(id));
    if (newIds.length === 0) return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      const results = await Promise.all(newIds.map(fetchTweetMedia));
      if (!cancelled) {
        // Only mark as fetched after successful completion
        newIds.forEach((id) => fetchedIdsRef.current.add(id));
        setMedia((prev) => [...prev, ...results.flat()]);
        setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [ids]);

  const renderSlideHeader = useCallback(
    ({ slide }: { slide: Slide }) => {
      const tweetId = (slide as Slide & { tweetId?: string }).tweetId;
      if (!tweetId) return null;
      return <LightboxTweetOverlay tweetId={tweetId} />;
    },
    [],
  );

  return (
    <>
      <div className="album-grid">
        {media.map((item, i) => (
          <AlbumCard
            key={`${item.tweetId}-${item.src}`}
            src={item.src}
            alt={item.alt}
            onClick={() => setLightboxIndex(i)}
          />
        ))}
        {loading && <div className="album-loading">Loading images...</div>}
        {!loading && media.length === 0 && (
          <div className="album-loading">No images found</div>
        )}
      </div>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={media.map((item) => ({
          src: item.src,
          alt: item.alt,
          tweetId: item.tweetId,
        }))}
        render={{
          slideHeader: renderSlideHeader,
        }}
      />
    </>
  );
}
