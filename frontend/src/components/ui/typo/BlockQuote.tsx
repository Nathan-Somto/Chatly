import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const BlockQuote = ({ children, className, ...props }: TypoProps) => {
  return (
    <blockquote
      className={cn("mt-6 border-l-2 pl-6 italic ", className)}
      {...props}
    >
      {children}
    </blockquote>
  );
};

export default BlockQuote;
