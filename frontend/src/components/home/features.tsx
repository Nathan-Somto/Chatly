import { groupChats, privateMessage, videoMessage } from "@/assets";
import H2 from "../ui/typo/H2";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import Large from "../ui/typo/Large";

const data = [
  {
    imgUrl: videoMessage,
    heading2: "Visual Vibes, Instantly",
    para: "Send and receive vibrant video messages to add a personal touch to your conversations. Embrace the moment with Chatly's seamless video messaging.",
    id: uuidv4(),
    altText: "video messages",
  },
  {
    imgUrl: privateMessage,
    heading2: "Your Space, Your Rules",
    para: "Enjoy intimate conversations with the ones you hold close. With private conversations on Chatly, your messages stay between you and your chosen confidantes",
    id: uuidv4(),
    altText: "private messages",
  },
  {
    imgUrl: groupChats,
    heading2: "Gather Round, Chat Away",
    para: "Bring your favorite people together with group conversations on Chatly. Share laughs, make plans, and stay connected with everyone at once.",
    id: uuidv4(),
    altText: "group chats",
  },
];
function Features() {
  return (
    <section className="" id="features">
      <H2 className="text-center text-[#1B1C20] xl:text-5xl/normal text-4xl my-16">What Chatly Offers?</H2>
      {data.map((item, index) => (
        <article
          key={item.id}
          className={cn(
            "flex px-10 mt-8 lg:gap-[5%] max-w-[1440px] items-center lg:justify-around mx-auto py-8 lg:py-16 text-center lg:text-left bg-[#F8F8FA] lg:flex-row flex-col",
            index % 2 !== 0 && "lg:flex-row-reverse bg-white"
          )}
        >
          <figure className= "w-[22rem] h-[15rem] sm:w-[32rem]  sm:h-[22rem] flex-shrink-0">
            <img
              src={item.imgUrl}
              alt={item.altText}
              className="h-full w-full object-contain"
            />
          </figure>
          <div className={"lg:w-[500px] w-full max-w-[500px] mt-12 lg:mt-0"}>
            <H2 className="text-[#1B1C20] text-4xl lg:mb-3 xl:mb-4 w-[80%] mb-5 mx-auto lg:mx-0 lg:w-[90%] xl:text-5xl/normal">
              {item.heading2}
            </H2>
            <Large className="w-[90%] mx-auto text-base xl:text-lg lg:mx-0 text-[#383A47] font-medium">
              {item.para}
            </Large>
          </div>
        </article>
      ))}
    </section>
  );
}

export default Features;
