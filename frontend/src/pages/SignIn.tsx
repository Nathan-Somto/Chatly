import { useTheme } from "@/components/wrappers/theme-provider";
import { clerkConfig } from "@/constants";
import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  const {theme} = useTheme();
  return (
    <SignIn
      afterSignInUrl={`/chats-redirect`}
      signUpUrl="/sign-up"
      appearance={clerkConfig(theme)}
      routing="path"
      path="/sign-in"
    />
  );
}

export default SignInPage;
