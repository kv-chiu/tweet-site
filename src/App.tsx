import { useCallback } from 'react';
import { useSiteConfig } from './hooks/useSiteConfig';
import { useMediaItems } from './hooks/useMediaItems';
import { useAdminMode } from './hooks/useAdminMode';
import { Header } from './components/Header';
import { TweetFeed } from './components/TweetFeed';
import './App.css';

function App() {
  const { config, loading: configLoading, error: configError } = useSiteConfig();
  const { visibleItems, hasMore, loadMore, removeItem, loading: dataLoading, error: dataError } =
    useMediaItems(config.batchSize, config.repo);
  const secret = useAdminMode();

  const handleDeleted = useCallback((id: string) => {
    removeItem(id);
  }, [removeItem]);

  if (configLoading || dataLoading) {
    return <div className="app-status">Loading...</div>;
  }

  if (configError || dataError) {
    return <div className="app-status error">{configError || dataError}</div>;
  }

  return (
    <>
      <Header
        title={config.title}
        description={config.description}
      />
      <TweetFeed
        items={visibleItems}
        columns={config.columns}
        hasMore={hasMore}
        onLoadMore={loadMore}
        secret={secret}
        onDeleted={handleDeleted}
      />
    </>
  );
}

export default App;
