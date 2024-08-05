import { useQuery } from "@tanstack/react-query";
import { GetQueryType, GetResponse } from "./index.d";
import React, { useEffect, useState } from "react";
import { displayError } from "@/lib/utils";
import toast from "react-hot-toast";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";
import { AxiosError } from "axios";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export function useGetQuery<T>({
  enabled,
  route,
  queryKey,
  defaultMessage = "failed to fetch",
  displayToast = false,
  refetchOnMount = false
}: GetQueryType<T>) {
  const {signOut} = useAuth();
  const navigate = useNavigate();
  const [localEnabled, setLocalEnabled] = useState(false);
  const [retryCount, setRetryCount] = useState(0); // Add state for retry count
  const { token, refetchToken } = useGetToken();

  useEffect(() => {
    if (token !== null && enabled) {
      setLocalEnabled(true);
    } else {
      setLocalEnabled(false);
    }
  }, [token, enabled]);

  const { data, isPending, refetch, error, isError } = useQuery<GetResponse<T>>({
    enabled: localEnabled,
    queryKey,
    queryFn: () => mainApi.get(route, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }),
    refetchOnMount
  });

  React.useEffect(() => {
    if (displayToast && isError && error) {
      console.error('[errorlog]', error);
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
        if (error.response?.data?.unauthenticated) {
          if (retryCount < 3) {
            refetchToken();
            refetch();
            setRetryCount(prevCount => prevCount + 1);
          } else {
            console.error('Max retries reached. Stopping further retries.');
            signOut();
            navigate('/sign-in');
          }
        }
      }
      toast.error(displayError(error, defaultMessage));
    }
  }, [displayToast, isError, error, toast, retryCount, refetchToken, refetch]);

  return {
    data,
    isPending,
    refetch,
    error,
    isError,
  };
}