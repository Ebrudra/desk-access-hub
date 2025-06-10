
import { useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import { useCallback } from "react";

interface OptimizedQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  queryKey: string[];
  queryFn: () => Promise<T>;
  optimisticUpdate?: (data: T) => T;
}

export const useOptimizedQuery = <T,>({
  queryKey,
  queryFn,
  optimisticUpdate,
  ...options
}: OptimizedQueryOptions<T>) => {
  const queryClient = useQueryClient();

  const result = useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: (failureCount, error: any) => {
      // Don't retry on auth errors
      if (error?.status === 401 || error?.status === 403) {
        return false;
      }
      return failureCount < 3;
    },
    ...options,
  });

  const invalidateQuery = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const updateCache = useCallback((updater: (oldData: T | undefined) => T) => {
    queryClient.setQueryData(queryKey, updater);
  }, [queryClient, queryKey]);

  const prefetchRelated = useCallback((relatedKeys: string[][]) => {
    relatedKeys.forEach(key => {
      queryClient.prefetchQuery({ queryKey: key, queryFn });
    });
  }, [queryClient, queryFn]);

  return {
    ...result,
    invalidateQuery,
    updateCache,
    prefetchRelated,
  };
};
