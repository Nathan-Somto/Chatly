import { QueryKey } from "@tanstack/react-query";
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
    onSuccess?: (response: AxiosResponse<any, any>) => void;
    onSettled?: () => void;
    onError?: () => void;
    defaultMessage: string;
    displayToast?: boolean;
    method: "post" | 'patch' | 'put'
}
export type GetResponse<T> = {
    data: T;
}