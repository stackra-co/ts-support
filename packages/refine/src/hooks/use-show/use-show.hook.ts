/**
 * @fileoverview useShow Hook
 *
 * Enhanced useShow hook that wraps the original Refine useShow
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useShow as useShowOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseShowProps, UseShowReturnType } from './use-show.types';

/**
 * useShow Hook
 *
 * Enhanced version of Refine's useShow hook that exposes loading states directly.
 * Fetches a single record for show/detail pages.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { data, isLoading, showId, setShowId } = useShow({
 *   resource: 'posts',
 * });
 *
 * if (isLoading) return <Spinner />;
 * return <div>{data?.title}</div>;
 * ```
 *
 * @example With explicit ID
 * ```typescript
 * const { data, isLoading } = useShow({
 *   resource: 'posts',
 *   id: 1,
 * });
 * ```
 *
 * @example Dynamic ID change
 * ```typescript
 * const { data, isLoading, setShowId } = useShow({
 *   resource: 'posts',
 * });
 *
 * // Change the ID dynamically
 * setShowId(newId);
 * ```
 */
export const useShow = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>(
  props?: UseShowProps<TQueryFnData, TError, TData>
): UseShowReturnType<TData, TError> => {
  const result = useShowOriginal<TQueryFnData, TError, TData>(props);

  return {
    data: result.result,
    isLoading: result.query.isLoading,
    isFetching: result.query.isFetching,
    isError: result.query.isError,
    isSuccess: result.query.isSuccess,
    error: result.query.error,
    showId: result.showId,
    setShowId: result.setShowId,
    refetch: result.query.refetch,
    query: result.query,
    overtime: result.overtime,
  };
};
