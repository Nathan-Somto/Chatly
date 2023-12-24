import { DarkWall, LightWall } from "@/assets";
import { useTheme } from "../wrappers/theme-provider";
import P from "../ui/typo/P";

function ChatBody() {
  const { theme } = useTheme();
  return (
    <main
      style={{
       backgroundImage: `url(${theme === "dark" ? DarkWall : LightWall})`,
        backgroundRepeat: "repeat",
        backgroundSize : "cover"
      }}
      className="mt-16 min-h-screen"
    >
        <P>A bunch of messages comes here</P>
    </main>
  );
}

export default ChatBody;
