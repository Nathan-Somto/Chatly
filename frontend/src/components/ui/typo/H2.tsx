import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const H2 = ({ children, className, ...props }: TypoProps) => {
  return (
    <h2
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export default H2;
