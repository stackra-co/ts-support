import { useCreateMany as useCreateManyOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseCreateManyProps, UseCreateManyReturnType } from './use-create-many.types';

export const useCreateMany = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>(
  props?: UseCreateManyProps<TData, TError, TVariables>
): UseCreateManyReturnType<TData, TError, TVariables> => {
  const result = useCreateManyOriginal<TData, TError, TVariables>(props ?? {});

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
    mutation: result.mutation as any,
    overtime: { elapsedTime: result.overtime?.elapsedTime },
  };
};
