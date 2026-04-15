import type { UseMutationResult } from '@tanstack/react-query';
import type {
  BaseRecord,
  HttpError,
  UpdateManyResponse,
  UseUpdateManyProps as UseUpdateManyPropsOriginal,
} from '@refinedev/core';

export type UseUpdateManyProps<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  TVariables = {},
> = UseUpdateManyPropsOriginal<TData, TError, TVariables>;

export interface UseUpdateManyReturnType<
  TData extends BaseRecord = BaseRecord,
  TError extends HttpError = HttpError,
  _TVariables = {},
> {
  mutate: (variables?: any, options?: any) => void;
  mutateAsync: (variables?: any, options?: any) => Promise<UpdateManyResponse<TData>>;
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  isIdle: boolean;
  error: TError | null;
  data: UpdateManyResponse<TData> | undefined;
  reset: () => void;
  mutation: UseMutationResult<UpdateManyResponse<TData>, TError, any, any>;
  overtime: { elapsedTime?: number };
}
