/**
 * @fileoverview useDelete Hook
 *
 * Enhanced useDelete hook that wraps the original Refine useDelete
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useDelete as useDeleteOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseDeleteProps, UseDeleteReturnType } from './use-delete.types';

/**
 * useDelete Hook
 *
 * Enhanced version of Refine's useDelete hook that exposes loading states directly.
 * Deletes a record from the data provider.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, isError } = useDelete({
 *   resource: 'posts',
 * });
 *
 * const handleDelete = (id) => {
 *   mutate({ id });
 * };
 *
 * if (isLoading) return <Spinner />;
 * ```
 *
 * @example With async/await
 * ```typescript
 * const { mutateAsync, isLoading } = useDelete({
 *   resource: 'posts',
 * });
 *
 * const handleDelete = async (id) => {
 *   try {
 *     await mutateAsync({ id });
 *     console.log('Deleted successfully');
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 * ```
 *
 * @example With undoable mutation mode
 * ```typescript
 * const { mutate, isLoading } = useDelete({
 *   resource: 'posts',
 *   mutationMode: 'undoable',
 *   undoableTimeout: 5000,
 * });
 * ```
 */
export const useDelete = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>(
  props?: UseDeleteProps<TData, TError, TVariables>
): UseDeleteReturnType<TData, TError, TVariables> => {
  const result = useDeleteOriginal<TData, TError, TVariables>(props);

  return {
    mutate: result.mutate,
    mutateAsync: result.mutateAsync,
    isLoading: result.mutation.isPending,
    isError: result.mutation.isError,
    isSuccess: result.mutation.isSuccess,
    isIdle: result.mutation.isIdle,
    error: result.mutation.error,
    data: result.mutation.data,
    reset: result.mutation.reset,
    mutation: result.mutation as UseDeleteReturnType<TData, TError, TVariables>['mutation'],
    overtime: result.overtime,
  };
};
