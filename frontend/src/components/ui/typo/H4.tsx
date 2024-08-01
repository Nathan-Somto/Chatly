import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const H4 = ({ children, className, ...props }: TypoProps) => {
  return (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h4>
  );
};

export default H4;
