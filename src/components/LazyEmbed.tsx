import { useEffect, useRef, useState } from 'react';
import '../styles/lazy-embed.css';

interface LazyEmbedProps {
  children: React.ReactNode;
  height?: number;
}

export function LazyEmbed({ children, height = 300 }: LazyEmbedProps) {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Lazy load: only render embed when near viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Detect when iframe finishes loading via DOM mutation
  useEffect(() => {
    if (!visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      const iframe = el.querySelector('iframe');
      if (iframe) {
        setLoaded(true);
        observer.disconnect();
      }
    });

    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="lazy-embed">
      {!loaded && (
        <div className="lazy-embed-skeleton" style={{ minHeight: height }}>
          <div className="lazy-embed-skeleton-header">
            <div className="lazy-embed-skeleton-avatar" />
            <div className="lazy-embed-skeleton-name" />
          </div>
          <div className="lazy-embed-skeleton-body" />
          <div className="lazy-embed-skeleton-footer" />
        </div>
      )}
      {visible && (
        <div className={loaded ? 'lazy-embed-content' : 'lazy-embed-content lazy-embed-hidden'}>
          {children}
        </div>
      )}
    </div>
  );
}
