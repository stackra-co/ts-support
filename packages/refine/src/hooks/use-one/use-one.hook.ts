/**
 * @fileoverview useOne Hook
 *
 * Enhanced useOne hook that wraps the original Refine useOne
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useOne as useOneOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseOneProps, UseOneReturnType } from './use-one.types';

/**
 * useOne Hook
 *
 * Enhanced version of Refine's useOne hook that exposes loading states directly.
 * Fetches a single record from the data provider.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { data, isLoading, isError, error } = useOne({
 *   resource: 'posts',
 *   id: 1,
 * });
 *
 * if (isLoading) return <Spinner />;
 * if (isError) return <Error message={error.message} />;
 * return <div>{data?.title}</div>;
 * ```
 *
 * @example With meta data
 * ```typescript
 * const { data, isLoading } = useOne({
 *   resource: 'posts',
 *   id: 1,
 *   meta: {
 *     populate: ['author', 'category'],
 *   },
 * });
 * ```
 */
export const useOne = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>(
  props: UseOneProps<TQueryFnData, TError, TData>
): UseOneReturnType<TData, TError> => {
  const result = useOneOriginal<TQueryFnData, TError, TData>(props);

  return {
    data: result.result,
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
