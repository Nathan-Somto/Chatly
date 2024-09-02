import { useEffect, useState } from "react";
import { InfiniteData, useInfiniteQuery as useIQ } from "@tanstack/react-query";
import { GetInfiniteQueryType } from ".";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";
import { useRefetchHelper } from "./useRefetchHelper";
import { AxiosResponse } from "axios";
import { PaginatedResponse } from "@/api-types";
type InfiniteDataResponse<K extends string, T> =  AxiosResponse<PaginatedResponse<K, T>> | undefined

export default function useInfiniteQuery<K extends string, T>({
  queryKey,
  enabled,
  route,
  defaultMessage,
  displayToast,
  cursorKey = "cursor",
  nextCursorKey = "nextCursor",
}: GetInfiniteQueryType<T>) {
  const [localEnabled, setLocalEnabled] = useState(false);
  const { token, refetchToken } = useGetToken();

  useEffect(() => {
    if (token !== null && enabled) {
      setLocalEnabled(true);
    } else {
      setLocalEnabled(false);
    }
  }, [token, enabled]);
  const { refetch, error, isError, ...rest } = useIQ<InfiniteDataResponse<K,T>>({
    initialPageParam: null,
    queryKey,
    enabled: localEnabled,
    queryFn: ({ pageParam }) =>
      mainApi.get(
        `${route}${pageParam ? "?" + cursorKey + "=" + pageParam : ""}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      ),
    getNextPageParam: (lastPage) => lastPage?.data?.nextCursor ?? null,
  });
  useRefetchHelper({
    error,
    isError,
    refetch,
    refetchToken,
    defaultMessage,
    displayToast
  })
  return {
    refetch,
    error,
    isError,
    ...rest,
  }
}
