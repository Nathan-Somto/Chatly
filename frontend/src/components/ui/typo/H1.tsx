import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const H1 = ({ children, className, ...props }: TypoProps) => {
  return (
    <h1
      className={cn(
        "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};

export default H1;
