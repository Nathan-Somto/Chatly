import { Outlet } from "react-router-dom";
import DesktopOnly from "../common/DesktopOnly";
import { ClerkLoading, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/clerk-react";
import Loader from "../ui/loader";

const ProtectedRoute = () => {
  // if i am logged in with clerk and there is no profile in store.
  // fetch my profile from api, if no profile exists redirect to onboarding form else allow me to view the route
  return (
    <>
    <ClerkLoading>
      <Loader/>
    </ClerkLoading>
      <SignedIn>
        <Outlet />
        <DesktopOnly />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn redirectUrl={'/sign-in'} />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;
