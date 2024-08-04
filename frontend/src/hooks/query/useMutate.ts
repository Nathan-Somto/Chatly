import { useMutation } from "@tanstack/react-query";
import { MutateType } from "./index.d";
import { displayError } from "@/lib/utils";
import toast from "react-hot-toast";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";
import { AxiosError } from "axios";

function useMutate<T>({
  onSuccess,
  defaultMessage,
  route,
  method = "post",
  onSettled,
  onError,
  displayToast = true,
}: MutateType<T>) {
  const { token, refetchToken } = useGetToken();
  const { isPending, isSuccess, mutate, mutateAsync } = useMutation({
    mutationFn: (data: T) =>
      mainApi[method](route, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
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
  return { isPending, isSuccess, mutate, mutateAsync };
}
export { useMutate };
