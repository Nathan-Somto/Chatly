import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "./useProfile";
type Props = {
  isHomePage?: boolean;
};
export function useLogout({ isHomePage = false }: Props) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { removeProfile } = useProfileStore();

  async function handleLogout() {
    // handle clerk logout
    await signOut();
    // remove profile from store.
    removeProfile();
    // navigate to sign-in
    if (!isHomePage) {
      navigate("/sign-in");
    }
  }
  return { handleLogout };
}
