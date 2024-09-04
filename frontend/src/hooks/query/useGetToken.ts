import { TOKEN_REFRESH_TIME } from "@/constants";
import { useAuth } from "@clerk/clerk-react";
import React from "react";
type Props ={
  shouldFetchToken?: boolean;
}
export function useGetToken({shouldFetchToken=true}:Props) {
  const { getToken, isSignedIn } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);

  async function refetchToken() {
    if(!shouldFetchToken) return;
    console.log("refetching...");
    const gottenToken = await getToken({
      template: "auth-token",
    });
    setToken(gottenToken);
  }

  React.useEffect(() => {
    let isMounted = true;

    async function fetchToken() {
      const gottenToken = await getToken({
        template: "auth-token",
      });
      console.log("gottenToken: ", gottenToken);
      if (isMounted) {
        setToken(gottenToken);
      }
    }

   async function checkTokenExpiry() {
      const firstUseDateStr = localStorage.getItem("firstUseDate");
      const now = new Date().getTime();

      if (firstUseDateStr) {
        const firstUseDate = new Date(firstUseDateStr).getTime();
        const timeDiff = now - firstUseDate;

        if (timeDiff > TOKEN_REFRESH_TIME * 1000) {
          await refetchToken();
          console.log("fetching token after expiry time...");
          localStorage.setItem("firstUseDate", new Date().toISOString());
        }
      } 
    }
    if(!shouldFetchToken) return;
      fetchToken();
    if (isSignedIn) {
      checkTokenExpiry();
    }

    return () => {
      isMounted = false;
    };
  }, [getToken,isSignedIn, shouldFetchToken]);

  return { token, refetchToken };
}
