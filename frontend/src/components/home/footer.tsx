import { Logo } from "@/assets";
import { Button } from "../ui/button";
import H2 from "../ui/typo/H2";
import { v4 as uuidv4 } from "uuid";
import { Link } from "react-router-dom";
import {
  FacebookIcon,
  InstagramIcon,
  TwitterIcon,
  YoutubeIcon,
} from "lucide-react";
import React from "react";
import P from "../ui/typo/P";
const middleData = [
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
    text: "works",
    link: "#",
    id: uuidv4(),
  },
  {
    text: "Support",
    link: "#",
    id: uuidv4(),
  },
];
const rightData = [
  {
    link: "http://facebook.com",
    icon: React.createElement(FacebookIcon),
    id: uuidv4(),
  },
  {
    link: "https://twitter.com",
    icon: React.createElement(TwitterIcon),
    id: uuidv4(),
  },
  {
    link: "https://instagram.com",
    icon: React.createElement(InstagramIcon),
    id: uuidv4(),
  },
  {
    link: "https://youtube.com",
    icon: React.createElement(YoutubeIcon),
    id: uuidv4(),
  },
];
function Footer() {
  return (
    <>
      <div id="footer-top" className="max-w-[1440px] mx-auto my-4 px-10 py-10 text-center">
        <H2 data-aos="fade-up" data-aos-anchor="#footer-top" className="max-w-[46rem] mx-auto mb-9 text-[#1B1C20] dark:text-gray-200 xl:text-5xl/normal text-4xl">
          Ready to Start Chatting about with Friends and Family
        </H2>
        <Button data-aos="zoom-in" data-aos-delay={300}  data-aos-anchor="#footer-top" className="mx-auto lg:text-lg text-white">Start Chatting now!</Button>
      </div>
      <footer data-aos="fade" data-aos-delay={400} className="flex sm:flex-row gap-5 sm:gap-0 flex-col justify-between max-w-[1440px] mx-auto px-10">
        <figure className="h-28 w-28">
          <img src={Logo} alt="logo" className="w-full h-full" />
        </figure>
        <ul className="flex items-center flex-wrap sm:justify-center gap-4">
          {middleData.map((item) => (
            <li
              key={item.id}
              className="border-b-2 text-[16.25px] border-transparent hover:opacity-50 md:hover:opacity-100 md:hover:border-b-brand-p1 font-medium"
            >
              <Link to={item.link}>{item.text}</Link>
            </li>
          ))}
        </ul>
        <ul className="flex items-center flex-wrap gap-4">
          {rightData.map((item) => (
            <a
              target="_blank"
              href={item.link}
              key={item.id}
              className="h-8 w-8  !text-brand-p2 hover:scale-125 ease-in-out transition-all"
            >
              {item.icon}
            </a>
          ))}
        </ul>
      </footer>
      <footer className="bg-brand-p1 mt-6 w-full font-semibold text-white max-w-[1440px] px-10 py-2 text-center">
        <P className="text-lg">
          Created by{" "}
          <a
            href="https://github.com/nathan-somto"
            target="_blank"
            className="text-white/70"
          >
            Nathan Somto
          </a>
        </P>
      </footer>
    </>
  );
}

export default Footer;
