/**
 * @fileoverview useDelete Hook Types
 *
 * Type definitions for the enhanced useDelete hook.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import type { UseMutationResult } from '@tanstack/react-query';
import type {
  BaseRecord,
  HttpError,
  DeleteOneResponse,
  BaseKey,
  MutationMode,
  UseDeleteProps as UseDeletePropsOriginal,
} from '@refinedev/core';

/**
 * Props for useDelete hook
 */
export type UseDeleteProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  _TVariables = {},
> = UseDeletePropsOriginal<TData, TError, TVariables>;

/**
 * Mutation variables for delete operation
 */
export interface DeleteMutationVariables<TVariables = {}> {
  resource?: string;
  id?: BaseKey;
  values?: TVariables;
  meta?: Record<string, any>;
  dataProviderName?: string;
  invalidates?: Array<'list' | 'many' | 'detail' | 'all'>;
  mutationMode?: MutationMode;
  undoableTimeout?: number;
  onCancel?: (cancelMutation: () => void) => void;
  successNotification?: any;
  errorNotification?: any;
}

/**
 * Return type for useDelete hook
 */
export interface UseDeleteReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  _TVariables = {},
> {
  /** Execute the delete mutation */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutate: (variables?: any, options?: any) => void;
  /** Execute the delete mutation and return a promise */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutateAsync: (variables?: any, options?: any) => Promise<DeleteOneResponse<TData>>;
  /** Loading state - true while mutation is in progress */
  isLoading: boolean;
  /** Error state */
  isError: boolean;
  /** Success state */
  isSuccess: boolean;
  /** Idle state - mutation has not been called yet */
  isIdle: boolean;
  /** Error object if mutation failed */
  error: TError | null;
  /** Response data from successful mutation */
  data: DeleteOneResponse<TData> | undefined;
  /** Reset mutation state */
  reset: () => void;
  /** Original mutation object for advanced usage */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<DeleteOneResponse<TData>, TError, any, any>;
  /** Overtime information */
  overtime: { elapsedTime?: number };
}
