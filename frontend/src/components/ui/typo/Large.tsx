import { cn } from "@/lib/utils";
import { TypoProps } from "./type";

const Large = ({ children, className, ...props }: TypoProps) => {
  return (
    <div className={cn("text-lg font-semibold", className)} {...props}>
      {children}
    </div>
  );
};

export default Large;
