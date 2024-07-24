import { useQuery } from "@tanstack/react-query";
import { GetQueryType, GetResponse } from "./index.d";
import React from "react";
import { displayError } from "@/lib/utils";
import toast from "react-hot-toast";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";

export function useGetQuery<T>({
  enabled,
  route,
  queryKey,
  defaultMessage = "failed to fetch",
  displayToast=false
}: GetQueryType<T>) {
  const {token} = useGetToken();
  const { data, isPending, refetch, error, isError } = useQuery<GetResponse<T>>({
    enabled: token !== null && enabled,
    queryKey,
    queryFn: () => mainApi.get(route, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }),
  });
  
  React.useEffect(() => {
    if (displayToast && isError && error) {
     toast.error(displayError(error, defaultMessage));
    }
  }, [displayToast, isError, error, toast]);
  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
}