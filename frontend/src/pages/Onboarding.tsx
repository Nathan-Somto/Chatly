import { Logo } from "@/assets";
import AuthForm from "@/components/auth/auth-form";
import H2 from "@/components/ui/typo/H2";
import P from "@/components/ui/typo/P";
import { ThemeToggle } from "@/components/wrappers/theme-toggle";
import { Link } from "react-router-dom";
function Onboarding() {
  const userData = {
    username: "nathan_somto",
    bio: "i love coding and watching sports games",
    avatar: "https://www.google.com",
  };
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 pb-8">
      <header
        className="
      h-16 
      top-0 
      z-[8] 
      w-full 
      px-5 
      py-3
      flex
      justify-between
      items-center
      inset-x-0
      border-b
      "
      >
        <Link to="/">
        <img src={Logo} alt="logo"  className="
        h-[80px]
        w-[80px]
        object-cover
        "/>
        </Link>
        <ThemeToggle/>
      </header>
      <main className="max-w-[600px] mt-24 min-h-[400px] py-7 rounded-lg bg-white dark:bg-gray-600 ring-2 ring-[#ddd]/80 dark:ring-gray-600/80 px-8 mx-auto">
        <div className="mb-6 text-center space-y-5">
          <H2 className="text-4xl">Set Up Profile</H2>
          <P>Complete your sign-up by taking time to fill this form</P>
        </div>
        <AuthForm {...userData} />
      </main>
    </div>
  );
}

export default Onboarding;
