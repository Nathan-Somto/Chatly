import { GetUserResponse } from "@/api-types";
import { ErrorMessage } from "@/components/common/error-message";
import LogoLoader from "@/components/common/logo-loader";
import P from "@/components/ui/typo/P";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useProfileStore } from "@/hooks/useProfile";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function ChatsRedirect() {
  const navigate = useNavigate();
  const { setProfile } = useProfileStore();
  const {
    data: response,
    isError,
    refetch,
  } = useGetQuery<GetUserResponse>({
    enabled: true,
    queryKey: ["profile"],
    route: `/users/profile`,
    displayToast: true,
  });
  if (isError) {
    <ErrorMessage title="Failed to load user's chats" refetch={refetch} />;
  }

  useEffect(() => {
    const data = response?.data;
    if (data) {
      if (!data?.user?.isOnboarded) {
        navigate("/onboarding");
        console.log(data);
      } else {
        setProfile(data?.user);
        navigate(`/${data?.user?.id}/chats`);
      }
    }
  }, [response]);
  return (
    <LogoLoader>
      <P className="text-center text-lg text-brand-p1 font-semibold mt-2">
        Loading Up Chats...
      </P>
    </LogoLoader>
  );
}
