import { QueryKey } from "@tanstack/react-query";
import { AxiosRequestConfig, AxiosResponse } from "axios";
export type GetQueryType<T> = {
    enabled: boolean,
    route: string,
    queryKey: QueryKey,
    displayToast?: boolean,
    defaultMessage?: string,
    refetchOnMount?: boolean
}
export type MutateType<T> = {
    route: string;
    method: "post" | 'patch' | 'put' | 'delete';
    onSuccess?: (response: AxiosResponse<any, any>) => void;
    onSettled?: () => void;
    onError?: () => void;
    defaultMessage?: string;
    displayToast?: boolean;
    reqOptions?: AxiosRequestConfig;
}
export type GetResponse<T> = {
    data: T;
}