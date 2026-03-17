interface AlbumCardProps {
  src: string;
  alt: string;
  onClick: () => void;
}

export function AlbumCard({ src, alt, onClick }: AlbumCardProps) {
  return (
    <div className="album-card" onClick={onClick}>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}
