/**
 * @fileoverview useCreate Hook
 *
 * Enhanced useCreate hook that wraps the original Refine useCreate
 * and exposes isLoading directly for better DX.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import { useCreate as useCreateOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseCreateProps, UseCreateReturnType } from './use-create.types';

/**
 * useCreate Hook
 *
 * Enhanced version of Refine's useCreate hook that exposes loading states directly.
 * Creates a new record in the data provider.
 *
 * @param props - Hook configuration options
 * @returns Enhanced return object with direct access to loading states
 *
 * @example
 * ```typescript
 * const { mutate, isLoading, isError, error } = useCreate({
 *   resource: 'posts',
 * });
 *
 * const handleSubmit = (values) => {
 *   mutate({ values });
 * };
 *
 * if (isLoading) return <Spinner />;
 * ```
 *
 * @example With async/await
 * ```typescript
 * const { mutateAsync, isLoading } = useCreate({
 *   resource: 'posts',
 * });
 *
 * const handleSubmit = async (values) => {
 *   try {
 *     const result = await mutateAsync({ values });
 *     console.log('Created:', result.data);
 *   } catch (error) {
 *     console.error('Failed:', error);
 *   }
 * };
 * ```
 *
 * @example With success callback
 * ```typescript
 * const { mutate, isLoading } = useCreate({
 *   resource: 'posts',
 *   successNotification: (data) => ({
 *     message: 'Post created successfully',
 *     type: 'success',
 *   }),
 * });
 * ```
 */
export const useCreate = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>(
  props?: UseCreateProps<TData, TError, TVariables>
): UseCreateReturnType<TData, TError, TVariables> => {
  const result = useCreateOriginal<TData, TError, TVariables>(props);

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
    mutation: result.mutation as UseCreateReturnType<TData, TError, TVariables>['mutation'],
    overtime: result.overtime,
  };
};
