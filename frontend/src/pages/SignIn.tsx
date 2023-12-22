import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  return (
    <SignIn
      afterSignInUrl={`/${isDesktop ? "desktop" : "mobile"}/chats/1234`}
      signUpUrl="/sign-up"
    />
  );
}

export default SignInPage;
