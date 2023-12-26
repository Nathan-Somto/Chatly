import { ArrowRight } from "lucide-react";
import H1 from "../ui/typo/H1";
import P from "../ui/typo/P";
import { Button } from "../ui/button";
import { avatar1, avatar2, avatar3, heroImage, Stars } from "@/assets";
import H3 from "../ui/typo/H3";
import { useNavigate } from "react-router-dom";

function Hero() {
  const navigate = useNavigate();
  return (
    <header id="hero" className="mt-20 flex flex-col pt-12 max-w-[1440px] mx-auto gap-12 lg:pt-0 lg:gap-0 px-10 lg:flex-row lg:justify-between lg:items-center">
      <div
        data-aos="slide-right"
        data-aos-anchor="#hero"
        className="w-[90%] lg:w-[450px] xl:w-[600px] flex-shrink-0 self-start lg:mt-[80px]
      "
      >
        <H1 className="xl:text-6xl text-4xl sm:text-5xl max-sm:w-[300px] max-lg:max-w-[600px] w-full mb-4 lg:mb-6 lg:text-[42px]">
          Start chatting with friends, family, anytime, anywhere.
        </H1>
        <P className="text-[#383A47] opacity-80 mb-4 w-[90%]">
          Connecting you with friends and family, bringing the fun to every chat
          anytime, anywhere! Start your amazing conversations now.
        </P>
        <Button onClick={() => navigate("/sign-in")}>
          Start Chatting Now <ArrowRight />
        </Button>
        <div className="flex sm:flex-row flex-col sm:items-center gap-8 sm:gap-5 mt-12 sm:divide-x-2 sm:divide-[#383A47] ">
          <div className="flex items-center gap-4">
            <figure className="flex items-center">
              <img
                src={avatar2}
                alt="avatar 2"
                className="z-[0] relative h-[3.7rem] w-[3.7rem] object-cover"
              />
              <img
                src={avatar1}
                alt="avatar 1"
                className="z-[2] relative -ml-7 h-[3.7rem] w-[3.7rem] object-cover"
              />
              <img
                src={avatar3}
                alt="avatar 3"
                className="z-[3] relative -ml-6 h-[3.7rem] w-[3.7rem] object-cover"
              />
            </figure>
            <div className="space-y-1">
              <H3 className="text-xl">2.8K</H3>
              <P>Active Users</P>
            </div>
          </div>
          <div className="space-y-1 sm:pl-5">
            <H3 className="text-xl">4.8 / 5.0</H3>
            <P className="flex items-center gap-2">
              <img src={Stars} alt="stars" />
              <span>Rating</span>
            </P>
          </div>
        </div>
      </div>
      <figure data-aos="zoom-in" className="h-[450px]  lg:w-[550px]  w-full max-w-[700px] lg:max-w-none lg:h-auto">
        <img src={heroImage} alt="" className="h-full object-left w-full object-contain" />
      </figure>
    </header>
  );
}

export default Hero;
