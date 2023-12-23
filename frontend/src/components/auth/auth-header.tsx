import { Link } from "react-router-dom";
import { Logo } from "@/assets";
import { ThemeToggle } from "../wrappers/theme-toggle";

function AuthHeader() {
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
      <Link to="/">
        <img
          src={Logo}
          alt="logo"
          className="
    h-[80px]
    w-[80px]
    object-cover
    "
        />
      </Link>
      <ThemeToggle />
    </header>
  );
}

export default AuthHeader;
