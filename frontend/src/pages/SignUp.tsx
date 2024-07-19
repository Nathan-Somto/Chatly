import { useTheme } from "@/components/wrappers/theme-provider";
import { clerkConfig } from "@/constants";
import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  const { theme } = useTheme();
  return (
    <SignUp
      afterSignUpUrl={"/onboarding"}
      signInUrl="/sign-in"
      appearance={clerkConfig(theme)}
    />
  );
}

export default SignUpPage;
