import { Logo } from "@/assets";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
const linkData = [
  {
    text: "features",
    link: "#features",
    id: uuidv4(),
  },
  {
    text: "about",
    link: "#",
    id: uuidv4(),
  },
  {
    text: "blog",
    link: "#",
    id: uuidv4(),
  },
  {
    text: "contact",
    link: "#footer",
    id: uuidv4(),
  },
];
const navbar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 max-w-[1440px] mx-auto overflow-hidden w-full flex items-center justify-between px-10 py-4 h-20 z-[99999] bg-white">
      <img
        src={Logo}
        alt="chatly logo"
        className="h-24 w-24 scale-110 object-contain"
      />
      <div
        className={clsx({
          "gap-5 md:gap-0 transition-all ease-in duration-300 text-white justify-center items-center text-center text-2xl md:text-base md:text-black md:items-center md:justify-between md:flex-[0.8] fixed top-20 h-screen right-0 flex-col md:flex-row md:top-auto md:right-auto overflow-auto max-md:w-full  z-[20] md:relative md:flex":
            true,
          "flex max-md:bg-brand-p1 max-md:opacity-100": openMenu,
          "hidden max-md:bg-transparent max-md:opacity-0": !openMenu,
        })}
      >
        <ul className="md:flex-[0.8] md:items-center flex-col md:flex-row md:justify-center gap-5 md:gap-6 flex">
          {linkData.map((item) => (
            <li
              key={item.id}
              className="border-b-2 border-transparent hover:opacity-50 md:hover:opacity-100 md:hover:border-b-brand-p1 font-medium"
            >
              <Link to={item.link}>{item.text}</Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col md:flex-row items-center md:gap-3 gap-5">
          <Button
            variant="ghost"
            className="max-md:!p-0 max-md:!text-2xl max-md:!h-auto max-md:hover:!bg-transparent max-md:hover:!text-white max-md:hover:opacity-50"
          >
            Login
          </Button>
          <Button className="text-white max-md:!p-0 max-md:!text-2xl max-md:!h-auto max-md:hover:!bg-transparent max-md:hover:!text-white max-md:hover:opacity-50">
            Get Started
          </Button>
        </div>
      </div>
      <button
        onClick={() => setOpenMenu((prevState) => !prevState)}
        className="h-10 w-10 md:hidden block"
      >
        {openMenu ? <X /> : <Menu />}
      </button>
    </nav>
  );
};

export default navbar;
