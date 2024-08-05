import { useMutation } from "@tanstack/react-query";
import { MutateType } from "./index.d";
import { displayError } from "@/lib/utils";
import toast from "react-hot-toast";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";
import { AxiosError, AxiosRequestConfig} from "axios";
function useMutate<T>({
  onSuccess,
  defaultMessage="something went wrong!",
  route,
  method = "post",
  onSettled,
  onError,
  displayToast = true,
  reqOptions= {}
}: MutateType<T>) {
  const { token, refetchToken } = useGetToken();
  const { isPending, isSuccess, mutate, mutateAsync, ...rest } = useMutation({
    mutationFn: (data: T extends undefined | null ? void : T) =>{
      const reqConfig: AxiosRequestConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        ...reqOptions
      }
      if(method !== 'delete'){
       return mainApi[method](route, data, reqConfig);
      }
      return mainApi[method](route,reqConfig);
    },
    onSuccess: (response) => {
      if (onSuccess) {
        onSuccess(response);
      }
    },
    onError: (err) => {
      if(err instanceof AxiosError){
        if(err.response?.data?.unauthenticated || err.status === 401){
          refetchToken();
        }
      }
      if (onError) {
        onError();
      }
      if (displayToast) {
        toast.error(displayError(err, defaultMessage));
      }
    },
    onSettled: () => {
      if (onSettled) {
        onSettled();
      }
    },
  });
  return { isPending, isSuccess, mutate, mutateAsync, ...rest };
}
export { useMutate };
