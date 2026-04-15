/**
 * @fileoverview useMany Hook
 *
 * Enhanced useMany hook that wraps the original Refine useMany
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useMany as useManyOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseManyProps, UseManyReturnType } from './use-many.types';

/**
 * useMany Hook
 *
 * Enhanced version of Refine's useMany hook that exposes loading states directly.
 * Fetches multiple records by their IDs.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { data, isLoading, isError } = useMany({
 *   resource: 'posts',
 *   ids: [1, 2, 3],
 * });
 *
 * if (isLoading) return <Spinner />;
 * return <List items={data} />;
 * ```
 *
 * @example With meta data
 * ```typescript
 * const { data, isLoading } = useMany({
 *   resource: 'posts',
 *   ids: [1, 2, 3],
 *   meta: {
 *     populate: ['author'],
 *   },
 * });
 * ```
 */
export const useMany = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>(
  props: UseManyProps<TQueryFnData, TError, TData>
): UseManyReturnType<TData, TError> => {
  const result = useManyOriginal<TQueryFnData, TError, TData>(props);

  return {
    data: result.result.data,
    isLoading: result.query.isLoading,
    isFetching: result.query.isFetching,
    isError: result.query.isError,
    isSuccess: result.query.isSuccess,
    error: result.query.error,
    refetch: result.query.refetch,
    query: result.query,
    overtime: result.overtime,
  };
};
