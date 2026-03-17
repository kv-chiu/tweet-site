import type { ViewType } from '../types';
import { ViewToggle } from './ViewToggle';
import '../styles/header.css';

interface HeaderProps {
  title: string;
  description: string;
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function Header({ title, description, view, onViewChange }: HeaderProps) {
  return (
    <header className="site-header">
      <div className="site-header-text">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      <ViewToggle view={view} onViewChange={onViewChange} />
    </header>
  );
}
