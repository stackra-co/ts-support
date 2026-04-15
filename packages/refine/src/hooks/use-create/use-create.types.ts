/**
 * @fileoverview useCreate Hook Types
 *
 * Type definitions for the enhanced useCreate hook.
 *
 * @module @abdokouta/react-refine
 * @category Hooks
 */

import type { UseMutationResult } from '@tanstack/react-query';
import type {
  BaseRecord,
  HttpError,
  CreateResponse,
  UseCreateProps as UseCreatePropsOriginal,
} from '@refinedev/core';

/**
 * Props for useCreate hook
 */
export type UseCreateProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
> = UseCreatePropsOriginal<TData, TError, TVariables>;

/**
 * Mutation variables for create operation
 */
export interface CreateMutationVariables<TVariables = {}> {
  resource?: string;
  values?: TVariables;
  meta?: Record<string, any>;
  dataProviderName?: string;
  invalidates?: Array<'list' | 'many' | 'detail' | 'all'>;
  successNotification?: any;
  errorNotification?: any;
}

/**
 * Return type for useCreate hook
 */
export interface UseCreateReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
> {
  /** Execute the create mutation */
  mutate: (variables?: CreateMutationVariables<TVariables>, options?: any) => void;
  /** Execute the create mutation and return a promise */
  mutateAsync: (
    variables?: CreateMutationVariables<TVariables>,
    options?: any
  ) => Promise<CreateResponse<TData>>;
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
  data: CreateResponse<TData> | undefined;
  /** Reset mutation state */
  reset: () => void;
  /** Original mutation object for advanced usage */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  mutation: UseMutationResult<CreateResponse<TData>, TError, any, unknown>;
  /** Overtime information */
  overtime: {
    elapsedTime?: number;
  };
}
