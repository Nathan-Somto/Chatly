import { useMutation } from "@tanstack/react-query";
import { MutateType } from "./index.d";
import { displayError } from "@/lib/utils";
import toast from "react-hot-toast";
import { mainApi } from "@/lib/axios";
import { useGetToken } from "./useGetToken";


function useMutate<T>({onSuccess, defaultMessage, route, method='post', onSettled}:MutateType<T>) {
const {token} = useGetToken();
const {isPending, isSuccess, mutate, mutateAsync} = useMutation({
    mutationFn: (data: T) =>  mainApi[method](route, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    }),
    onSuccess: (response) => {
        if(onSuccess){
            onSuccess(response);
        }
    },
    onError: (err) => {
        toast.error(displayError(err, defaultMessage));
    }
    ,
    onSettled: () => {
        if(onSettled){
            onSettled();
        }
    }
});
return {isPending, isSuccess, mutate, mutateAsync};
}
export {useMutate}