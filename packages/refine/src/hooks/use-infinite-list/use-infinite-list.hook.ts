import { useInfiniteList as useInfiniteListOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseInfiniteListProps, UseInfiniteListReturnType } from './use-infinite-list.types';

export const useInfiniteList = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>(
  props: UseInfiniteListProps<TQueryFnData, TError, TData>
): UseInfiniteListReturnType<TData, TError> => {
  const result = useInfiniteListOriginal<TQueryFnData, TError, TData>(props);

  return {
    pages: result.result.data?.pages,
    hasNextPage: result.result.hasNextPage,
    hasPreviousPage: result.result.hasPreviousPage,
    isLoading: result.query.isLoading,
    isFetching: result.query.isFetching,
    isError: result.query.isError,
    isSuccess: result.query.isSuccess,
    isFetchingNextPage: result.query.isFetchingNextPage,
    isFetchingPreviousPage: result.query.isFetchingPreviousPage,
    fetchNextPage: result.query.fetchNextPage,
    fetchPreviousPage: result.query.fetchPreviousPage,
    error: result.query.error ?? null,
    query: result.query,
    overtime: { elapsedTime: result.overtime?.elapsedTime },
  };
};
