import { useCustom as useCustomOriginal } from '@refinedev/core';
import type { BaseRecord, HttpError } from '@refinedev/core';
import type { UseCustomProps, UseCustomReturnType } from './use-custom.types';

export const useCustom = <
  TQueryFnData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TQuery = unknown,
  TPayload = unknown,
  TData extends BaseRecord = TQueryFnData,
>(
  props: UseCustomProps<TQueryFnData, TError, TQuery, TPayload, TData>
): UseCustomReturnType<TData, TError> => {
  const result = useCustomOriginal<TQueryFnData, TError, TQuery, TPayload, TData>(props);

  return {
    data: result.result.data,
    isLoading: result.query.isLoading,
    isFetching: result.query.isFetching,
    isError: result.query.isError,
    isSuccess: result.query.isSuccess,
    error: result.query.error ?? null,
    refetch: result.query.refetch,
    query: result.query,
    overtime: { elapsedTime: result.overtime?.elapsedTime },
  };
};
