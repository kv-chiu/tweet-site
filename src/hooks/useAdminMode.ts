import { useEffect, useState } from 'react';

export function useAdminMode() {
  const [verified, setVerified] = useState(false);
  const [secret, setSecret] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get('secret');
    if (!s) return;

    fetch('/api/verify-secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: s }),
    })
      .then((res) => {
        if (res.ok) {
          setSecret(s);
          setVerified(true);
        }
      })
      .catch(() => {});
  }, []);

  return { secret, verified };
}
