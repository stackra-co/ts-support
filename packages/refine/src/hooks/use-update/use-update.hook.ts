/**
 * @fileoverview useUpdate Hook
 *
 * Enhanced useUpdate hook that wraps the original Refine useUpdate
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useUpdate as useUpdateOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseUpdateProps, UseUpdateReturnType } from './use-update.types';

/**
 * useUpdate Hook
 *
 * Enhanced version of Refine's useUpdate hook that exposes loading states directly.
 * Updates an existing record in the data provider.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, isError } = useUpdate({
 *   resource: 'posts',
 * });
 *
 * const handleUpdate = (id, values) => {
 *   mutate({ id, values });
 * };
 *
 * if (isLoading) return <Spinner />;
 * ```
 *
 * @example With async/await
 * ```typescript
 * const { mutateAsync, isLoading } = useUpdate({
 *   resource: 'posts',
 * });
 *
 * const handleUpdate = async (id, values) => {
 *   try {
 *     const result = await mutateAsync({ id, values });
 *     console.log('Updated:', result.data);
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 * ```
 *
 * @example With undoable mutation mode
 * ```typescript
 * const { mutate, isLoading } = useUpdate({
 *   resource: 'posts',
 *   mutationMode: 'undoable',
 *   undoableTimeout: 5000,
 * });
 * ```
 */
export const useUpdate = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>(
  props?: UseUpdateProps<TData, TError, TVariables>
): UseUpdateReturnType<TData, TError, TVariables> => {
  const result = useUpdateOriginal<TData, TError, TVariables>(props);

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
    mutation: result.mutation as UseUpdateReturnType<TData, TError, TVariables>['mutation'],
    overtime: result.overtime,
  };
};
