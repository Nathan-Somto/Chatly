import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const typoLarge = ({ children, className, ...props }: TypoProps) => {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </div>
  );
};

export default typoLarge;
