import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { displayError } from "@/lib/utils";
import toast from "react-hot-toast";
import { RefetchHelper } from ".";

export function useRefetchHelper({
  displayToast = false,
  defaultMessage = "failed to fetch",
  isError,
  error,
  refetch,
  refetchToken,
}: RefetchHelper) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (displayToast && isError && error) {
      console.error("[errorlog]", error);
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
        if (error.response?.data?.unauthenticated) {
          if (retryCount < 3) {
            refetchToken();
            refetch();
            setRetryCount((prevCount) => prevCount + 1);
          } else {
            console.error("Max retries reached. Stopping further retries.");
            signOut();
            navigate("/sign-in");
          }
        }
      }
      toast.error(displayError(error, defaultMessage));
    }
  }, [displayToast, isError, error]);
}
