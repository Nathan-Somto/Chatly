import { PropsWithChildren } from "react";
import { ThemeToggle } from "../wrappers/theme-toggle";

export default function Header({ children }: PropsWithChildren) {
  return (
    <header
      className="
  h-16 
  top-0 
  z-[8] 
  w-full 
  px-5 
  py-3
  flex
  justify-between
  items-center
  inset-x-0
  border-b
  "
    >
      {children}
      <ThemeToggle />
    </header>
  );
}
