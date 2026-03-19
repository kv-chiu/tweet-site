import { useMemo } from 'react';
import { useTheme } from '../hooks/useTheme';
import '../styles/header.css';

const slogans = [
  '散落的美，在这里重逢',
  // '把时间线变成画廊',
  // '你收藏的，值得被好好看',
  // '为喜欢的人，建一座收藏馆',
  // '每一张收藏，都是心动的瞬间',
];

interface HeaderProps {
  title: string;
  description: string;
}

export function Header({ title }: HeaderProps) {
  const slogan = useMemo(() => slogans[Math.floor(Math.random() * slogans.length)], []);
  const { resolved, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolved === 'light' ? 'dark' : 'light');
  };

  return (
    <header className="site-header">
      <div className="site-header-brand">
        <div className="site-header-brand-text">
          <h1>{title}</h1>
          <p>{slogan}</p>
        </div>
      </div>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
        {resolved === 'light' ? '\u263E' : '\u2600'}
      </button>
    </header>
  );
}
