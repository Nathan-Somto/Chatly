import { useAuth } from "@clerk/clerk-react";
import React from "react";

export function useGetToken() {
  const { getToken,isSignedIn } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    let interval: NodeJS.Timeout;
    async function fetchToken() {
      const gottenToken = await getToken();
      if (isMounted) {
        setToken(gottenToken);
      }
    }

    fetchToken();
    if(isSignedIn){
       interval = setInterval(() => {
        fetchToken();
        console.log("fetching token...")
      }, 60000);
    }

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [getToken, isSignedIn]);

  return { token };
}
