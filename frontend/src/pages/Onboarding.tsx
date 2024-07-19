import AuthForm from "@/components/auth/auth-form";
import AuthHeader from "@/components/auth/auth-header";
import H2 from "@/components/ui/typo/H2";
import P from "@/components/ui/typo/P";
function Onboarding() {
  const userData = {
    username: "nathan_somto",
    bio: "i just joined chatly!",
    avatar: "",
  };
  return (
    <div className="min-h-screen w-full  pb-8">
      <AuthHeader/>
      <main className="max-w-[550px] sm:w-full w-[90%] mt-24 min-h-[400px] py-7 rounded-lg bg-gray-50 dark:bg-[#17191C] ring-2 ring-[#ddd]/80 dark:ring-gray-500/80 px-8 mx-auto">
        <div className="mb-8  space-y-3">
          <H2 className="text-4xl">Set Up Profile</H2>
          <P>Complete your profile  filling this form</P>
        </div>
        <AuthForm {...userData} />
      </main>
    </div>
  );
}

export default Onboarding;
