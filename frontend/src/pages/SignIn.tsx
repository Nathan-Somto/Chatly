import { useTheme } from "@/components/wrappers/theme-provider";
import { clerkConfig } from "@/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const {theme} = useTheme();
  return (
    <SignIn
      afterSignInUrl={`/${isDesktop ? "desktop" : "mobile"}/chats/1234`}
      signUpUrl="/sign-up"
      appearance={clerkConfig(theme)}
    />
  );
}

export default SignInPage;
