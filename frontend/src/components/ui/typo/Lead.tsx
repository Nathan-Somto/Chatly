import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const Lead = ({ children, className, ...props }: TypoProps) => {
  return (
    <p className={cn("text-xl text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
};

export default Lead;
