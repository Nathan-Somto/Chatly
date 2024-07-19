import { Outlet } from "react-router-dom";
import DesktopOnly from "../common/DesktopOnly";

const ProtectedRoute = () => {
  // if i am logged in with clerk and there is no profile in store.
  // fetch my profile from api, if no profile exists redirect to onboarding form else allow me to view the route
  return (
  <>
  <Outlet/>
  <DesktopOnly/>
  </>)
};

export default ProtectedRoute;
