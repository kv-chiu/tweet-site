import { useState } from 'react';
import '../styles/delete-button.css';

interface DeleteButtonProps {
  tweetId: string;
  secret: string;
  onDeleted?: (tweetId: string) => void;
}

export function DeleteButton({ tweetId, secret, onDeleted }: DeleteButtonProps) {
  const [state, setState] = useState<'idle' | 'confirm' | 'deleting'>('idle');

  const handleDelete = async () => {
    if (state === 'idle') {
      setState('confirm');
      return;
    }

    setState('deleting');
    try {
      const res = await fetch('/api/add-tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, tweet: tweetId, action: 'remove' }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
        setState('idle');
      } else {
        onDeleted?.(tweetId);
      }
    } catch {
      alert('Delete failed');
      setState('idle');
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setState('idle');
  };

  return (
    <div className="delete-btn-wrap" onClick={(e) => e.stopPropagation()}>
      {state === 'confirm' && (
        <button className="delete-btn cancel" onClick={handleCancel}>
          Cancel
        </button>
      )}
      <button
        className={`delete-btn ${state === 'confirm' ? 'danger' : ''}`}
        onClick={handleDelete}
        disabled={state === 'deleting'}
      >
        {state === 'idle' && '✕'}
        {state === 'confirm' && 'Confirm?'}
        {state === 'deleting' && '...'}
      </button>
    </div>
  );
}
