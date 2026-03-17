import type { ViewType } from '../types';

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="view-toggle">
      <button
        className={view === 'waterfall' ? 'active' : ''}
        onClick={() => onViewChange('waterfall')}
        aria-label="Waterfall view"
        title="瀑布流"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="6" height="10" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="1" y="13" width="6" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="9" width="6" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
      <button
        className={view === 'album' ? 'active' : ''}
        onClick={() => onViewChange('album')}
        aria-label="Album view"
        title="相册"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="1" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
          <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>
    </div>
  );
}
