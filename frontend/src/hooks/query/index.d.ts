import { QueryKey } from "@tanstack/react-query";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
export type RefetchHelper = {
    displayToast?: boolean;
    defaultMessage?: string;
    isError: boolean;
    error: Error | AxiosError | null;
    refetch: () => void;
    refetchToken: () => Promise<void>;
  };
export type GetQueryType<T> = {
  enabled: boolean;
  route: string;
  queryKey: QueryKey;
  displayToast?: boolean;
  defaultMessage?: string;
  refetchOnMount?: boolean;
};
export type MutateType<T> = {
  route: string;
  method: "post" | "patch" | "put" | "delete";
  onSuccess?: (response: AxiosResponse<any, any>) => void;
  onSettled?: () => void;
  onError?: (() => void) | ((err: AxiosError) => void);
  defaultMessage?: string;
  displayToast?: boolean;
  noToken?: boolean;
  reqOptions?: AxiosRequestConfig;
};
export type GetResponse<T> = {
  data: T;
};
export type GetInfiniteQueryType<T> = {
  cursorKey?: string;
  nextCursorKey?: string;
} & GetQueryType<T>;
