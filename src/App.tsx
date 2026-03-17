import { useState } from 'react';
import { useSiteConfig } from './hooks/useSiteConfig';
import { useTweetIds } from './hooks/useTweetIds';
import { Header } from './components/Header';
import { TweetFeed } from './components/TweetFeed';
import type { ViewType } from './types';
import './App.css';

const VIEW_STORAGE_KEY = 'tweet-site-view';

function getInitialView(defaultView: ViewType): ViewType {
  const saved = localStorage.getItem(VIEW_STORAGE_KEY);
  if (saved === 'waterfall' || saved === 'album') return saved;
  return defaultView;
}

function App() {
  const { config, loading: configLoading, error: configError } = useSiteConfig();
  const { visibleIds, hasMore, loadMore, loading: tweetsLoading, error: tweetsError } =
    useTweetIds(config.batchSize, config.repo);

  const [view, setView] = useState<ViewType>(() => getInitialView(config.defaultView));

  const handleViewChange = (newView: ViewType) => {
    setView(newView);
    localStorage.setItem(VIEW_STORAGE_KEY, newView);
  };

  if (configLoading || tweetsLoading) {
    return <div className="app-status">Loading...</div>;
  }

  if (configError || tweetsError) {
    return <div className="app-status error">{configError || tweetsError}</div>;
  }

  return (
    <>
      <Header
        title={config.title}
        description={config.description}
        view={view}
        onViewChange={handleViewChange}
      />
      <TweetFeed
        ids={visibleIds}
        view={view}
        columns={config.columns}
        hasMore={hasMore}
        onLoadMore={loadMore}
      />
    </>
  );
}

export default App;
