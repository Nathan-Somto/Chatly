import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const Small = ({ children, className, ...props }: TypoProps) => {
  return (
    <small
      className={cn("text-sm font-medium leading-none", className)}
      {...props}
    >
      {children}
    </small>
  );
};

export default Small;
