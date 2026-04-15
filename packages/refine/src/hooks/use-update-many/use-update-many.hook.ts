import { useUpdateMany as useUpdateManyOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseUpdateManyProps, UseUpdateManyReturnType } from './use-update-many.types';

export const useUpdateMany = <
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
>(
  props?: UseUpdateManyProps<TData, TError, TVariables>
): UseUpdateManyReturnType<TData, TError, TVariables> => {
  const result = useUpdateManyOriginal<TData, TError, TVariables>(props ?? {});

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
