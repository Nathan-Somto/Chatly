import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const P = ({ children, className, ...props }: TypoProps) => {
  return (
    <p
      className={cn("leading-7 ", className)}
      {...props}
    >
      {children}
    </p>
  );
};

export default P;
