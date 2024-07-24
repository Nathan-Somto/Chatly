import { GetUserResponse } from "@/api-types";
import AuthForm from "@/components/auth/auth-form";
import AuthHeader from "@/components/auth/auth-header";
import { ErrorMessage } from "@/components/common/error-message";
import LogoLoader from "@/components/common/logo-loader";
import Loader from "@/components/ui/loader";
import H2 from "@/components/ui/typo/H2";
import P from "@/components/ui/typo/P";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useProfileStore } from "@/hooks/useProfileStore";
import { generateUsername } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Onboarding() {
  const { setProfile } = useProfileStore();
  const [userData, setUserData] = useState<GetUserResponse["user"] | null>(null);
  const navigate = useNavigate();
  const { isSignedIn, user, isLoaded } = useUser();
  const {
    data: response,
    isPending,
    isError,
    refetch,
  } = useGetQuery<GetUserResponse>({
    enabled: isSignedIn ?? false,
    queryKey: ["onboarding"],
    route: `/users/profile`,
    displayToast: false,
  });
  useEffect(() => {
    const data = response?.data;
    if (data && user) {
      console.log(data);
      const userDataCopy = {
        username:
          data?.user?.username ??
          generateUsername(
            user.firstName ??
              user.emailAddresses[0].emailAddress.split("@")[0] ??
              ""
          ),
        bio: data?.user?.bio ?? "i just joined chatly!",
        avatar: data?.user?.avatar ?? user.imageUrl,
        id: data?.user?.id ?? "",
        clerkId: user.id,
        isOnboarded: data?.user?.isOnboarded ?? false,
        email: data?.user?.email ?? user.emailAddresses[0].emailAddress,
      };
      setProfile(userDataCopy);
      if (data?.user.isOnboarded) {
        navigate(`/${data?.user?.id}/chats`);
      } else {
        setUserData(userDataCopy);
      }
    }
  }, [response, user]);
  if (!isSignedIn || !isLoaded) {
    return (
      <LogoLoader>
        <P className="text-center text-lg text-brand-p1 font-semibold mt-2">
          Checking Authentication Status...
        </P>
      </LogoLoader>
    );
  }
  if (isPending) {
    return <Loader />;
  }
  if (isError) {
    <ErrorMessage title="Failed to complete Onboarding" refetch={refetch} />;
  }
  return (
    <div className="min-h-screen w-full  pb-8">
      <AuthHeader />
      <main className="max-w-[550px] sm:w-full w-[90%] mt-24 min-h-[400px] py-7 rounded-lg bg-gray-50 dark:bg-[#17191C] ring-2 ring-[#ddd]/80 dark:ring-gray-500/80 px-8 mx-auto">
        <div className="mb-8  space-y-3">
          <H2 className="text-4xl">Set Up Profile</H2>
          <P>Complete your profile by filling this form</P>
        </div>
      {userData !== null && (<AuthForm {...userData} />)}  
      </main>
    </div>
  );
}

export default Onboarding;
