/**
 * @fileoverview useList Hook
 *
 * Enhanced useList hook that wraps the original Refine useList
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useList as useListOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseListProps, UseListReturnType } from './use-list.types';

/**
 * useList Hook
 *
 * Enhanced version of Refine's useList hook that exposes loading states directly.
 * Fetches a list of records with pagination, sorting, and filtering support.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { data, total, isLoading, isError } = useList({
 *   resource: 'posts',
 * });
 *
 * if (isLoading) return <Spinner />;
 * return <Table data={data} total={total} />;
 * ```
 *
 * @example With pagination
 * ```typescript
 * const { data, total, isLoading } = useList({
 *   resource: 'posts',
 *   pagination: {
 *     current: 1,
 *     pageSize: 10,
 *   },
 * });
 * ```
 *
 * @example With filters and sorters
 * ```typescript
 * const { data, isLoading } = useList({
 *   resource: 'posts',
 *   filters: [
 *     { field: 'status', operator: 'eq', value: 'published' },
 *   ],
 *   sorters: [
 *     { field: 'createdAt', order: 'desc' },
 *   ],
 * });
 * ```
 */
export const useList = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TData extends BaseRecord = TQueryFnData,
>(
  props?: UseListProps<TQueryFnData, TError, TData>
): UseListReturnType<TData, TError> => {
  const result = useListOriginal<TQueryFnData, TError, TData>(props);

  return {
    data: result.result.data,
    total: result.result.total,
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
