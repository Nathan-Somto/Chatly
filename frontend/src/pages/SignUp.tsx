import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return <SignUp afterSignUpUrl={"/onboarding"} signInUrl="/sign-in" />;
}

export default SignUpPage;
