import { Link } from "react-router-dom";
import { Logo } from "@/assets";
import Header from "../common/header";

function AuthHeader() {
  return (
    <Header>
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
    </Header>
  );
}

export default AuthHeader;
