import { useDeleteMany as useDeleteManyOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseDeleteManyProps, UseDeleteManyReturnType } from './use-delete-many.types';

export const useDeleteMany = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>(
  props?: UseDeleteManyProps<TData, TError, TVariables>
): UseDeleteManyReturnType<TData, TError, TVariables> => {
  const result = useDeleteManyOriginal<TData, TError, TVariables>(props ?? {});

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
