import type { InfiniteData, UseInfiniteQueryResult } from '@tanstack/react-query';
import type {
  BaseRecord,
  HttpError,
  GetListResponse,
  UseInfiniteListProps as UseInfiniteListPropsOriginal,
} from '@refinedev/core';

export type UseInfiniteListProps<
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
> = UseInfiniteListPropsOriginal<TQueryFnData, TError, TData>;

export interface UseInfiniteListReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
> {
  /** All pages of fetched data */
  pages: GetListResponse<TData>[] | undefined;
  /** Whether there is a next page */
  hasNextPage: boolean | undefined;
  /** Whether there is a previous page */
  hasPreviousPage: boolean | undefined;
  /** Loading state */
  isLoading: boolean;
  /** Fetching state */
  isFetching: boolean;
  /** Error state */
  isError: boolean;
  /** Success state */
  isSuccess: boolean;
  /** Whether next page is being fetched */
  isFetchingNextPage: boolean;
  /** Whether previous page is being fetched */
  isFetchingPreviousPage: boolean;
  /** Fetch the next page */
  fetchNextPage: UseInfiniteQueryResult<
    InfiniteData<GetListResponse<TData>>,
    TError
  >['fetchNextPage'];
  /** Fetch the previous page */
  fetchPreviousPage: UseInfiniteQueryResult<
    InfiniteData<GetListResponse<TData>>,
    TError
  >['fetchPreviousPage'];
  /** Error object */
  error: TError | null;
  /** Original query object */
  query: UseInfiniteQueryResult<InfiniteData<GetListResponse<TData>>, TError>;
  /** Overtime information */
  overtime: { elapsedTime?: number };
}
