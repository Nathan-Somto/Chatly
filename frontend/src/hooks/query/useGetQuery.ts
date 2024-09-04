import { useQuery } from "@tanstack/react-query";
import { GetQueryType, GetResponse } from "./index.d";
import { useEffect, useState } from "react";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";
import { useRefetchHelper } from "./useRefetchHelper";

export function useGetQuery<T>({
  enabled,
  route,
  queryKey,
  defaultMessage = "failed to fetch",
  displayToast = false,
  refetchOnMount = false
}: GetQueryType<T>) {
  const [localEnabled, setLocalEnabled] = useState(false);
  const { token, refetchToken } = useGetToken({ shouldFetchToken: true });

  useEffect(() => {
    if (token !== null && enabled) {
      setLocalEnabled(true);
    } else {
      setLocalEnabled(false);
    }
  }, [token, enabled]);

  const { data, isPending, refetch, error, isError, ...rest } = useQuery<GetResponse<T>>({
    enabled: localEnabled,
    queryKey,
    queryFn: () => mainApi.get(route, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }),
    refetchOnMount,
    
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
    data,
    isPending,
    refetch,
    error,
    isError,
    ...rest
  };
}