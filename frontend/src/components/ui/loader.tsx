import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

const className =
  "rounded-full border-t-transparent border-b-brand-p1 border-l-brand-p1 border-r-brand-p1 border-2 animate-spin";
const loaderVariants = cva(className, {
  variants: {
    size: {
      default: "h-10 w-10",
      sm: "h-6 w-6",
      lg: "h-16 w-16",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
type Props = {
  withBackground?: boolean;
} & VariantProps<typeof loaderVariants> &
  React.HTMLAttributes<HTMLDivElement>;
function Loader({ withBackground=true, className, size }: Props) {
  const Container = !withBackground ? React.Fragment : "div";
  return (
    <Container className="h-screen w-full fixed backdrop-blur-md flex items-center justify-center inset-0 transition-all delay-150 z-[999999999999999999]">
      <div className={cn(loaderVariants({ className, size }))}></div>
    </Container>
  );
}

export default Loader;
