
import { useState, useEffect, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  hasMore: boolean;
  isLoading: boolean;
}

export function useInfiniteScroll(
  fetchMore: () => void,
  options: UseInfiniteScrollOptions
) {
  const { threshold = 100, hasMore, isLoading } = options;
  const [isFetching, setIsFetching] = useState(false);

  const handleScroll = useCallback(() => {
    if (isLoading || !hasMore || isFetching) return;

    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - threshold) {
      setIsFetching(true);
      fetchMore();
    }
  }, [fetchMore, hasMore, isLoading, isFetching, threshold]);

  useEffect(() => {
    if (!isFetching) return;
    
    const timer = setTimeout(() => {
      setIsFetching(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isFetching]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return { isFetching };
}
