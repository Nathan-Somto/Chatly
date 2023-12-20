import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const typoMuted = ({ children, className, ...props }: TypoProps) => {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
};

export default typoMuted;
