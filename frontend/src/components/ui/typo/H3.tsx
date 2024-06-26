import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const H3 = ({ children, className, ...props }: TypoProps) => {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-2xl font-semibold tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};

export default H3;
