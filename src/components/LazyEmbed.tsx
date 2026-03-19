import { useEffect, useRef, useState } from 'react';
import '../styles/lazy-embed.css';

interface LazyEmbedProps {
  children: React.ReactNode;
  height?: number;
}

export function LazyEmbed({ children, height = 300 }: LazyEmbedProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="lazy-embed">
      {visible ? children : <div style={{ minHeight: height }} />}
    </div>
  );
}
