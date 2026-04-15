/**
 * @fileoverview useUpdate Hook Types
 *
 * Type definitions for the enhanced useUpdate hook.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import type { UseMutationResult } from '@tanstack/react-query';
import type {
  BaseRecord,
  HttpError,
  UpdateResponse,
  BaseKey,
  MutationMode,
  UseUpdateProps as UseUpdatePropsOriginal,
} from '@refinedev/core';

/**
 * Props for useUpdate hook
 */
export type UseUpdateProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
> = UseUpdatePropsOriginal<TData, TError, TVariables>;

/**
 * Mutation variables for update operation
 */
export interface UpdateMutationVariables<TVariables = {}> {
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
 * Return type for useUpdate hook
 */
export interface UseUpdateReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
> {
  /** Execute the update mutation */
  mutate: (variables?: UpdateMutationVariables<TVariables>, options?: any) => void;
  /** Execute the update mutation and return a promise */
  mutateAsync: (
    variables?: UpdateMutationVariables<TVariables>,
    options?: any
  ) => Promise<UpdateResponse<TData>>;
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
  data: UpdateResponse<TData> | undefined;
  /** Reset mutation state */
  reset: () => void;
  /** Original mutation object for advanced usage */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<UpdateResponse<TData>, TError, any, any>;
  /** Overtime information */
  overtime: { elapsedTime?: number };
}
