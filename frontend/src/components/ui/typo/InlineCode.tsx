import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const InlineCode = ({ children, className, ...props }: TypoProps) => {
  return (
    <code
      className={cn(
        "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
};

export default InlineCode;
