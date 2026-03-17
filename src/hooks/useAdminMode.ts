import { useMemo } from 'react';

export function useAdminMode() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('secret') || '';
  }, []);
}
