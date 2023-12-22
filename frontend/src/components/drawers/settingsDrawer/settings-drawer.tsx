import { SheetContent, SheetHeader, Sheet } from "@/components/ui/sheet";
import {
  GitPullRequestIcon,
  LogOutIcon,
  MoonIcon,
  Trash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { avatar2 } from "@/assets";
import { v4 as uuidv4 } from "uuid";
import GroupIcon from "./GroupIcon";
import WallpaperIcon from "./WallpaperIcon";
import P from "@/components/ui/typo/P";
import EditInput from "./edit-input";
import SettingsItem from "./settings-item";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/wrappers/theme-provider";
const data = [
  {
    text: "New Group chat",
    icon: GroupIcon,
  },
  {
    text: "Chat Wallpaper",
    icon: WallpaperIcon,
  },
  {
    text: "Request Feature",
    icon: GitPullRequestIcon,
  },
  {
    text: "Logout",
    icon: LogOutIcon,
  },
  {
    text: "Delete Account",
    icon: Trash,
  },
];
type Props = {
  isOpen: boolean;
  openDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};
function SettingsDrawer({ isOpen, openDrawer }: Props) {
  const username = "@Nathan_Somto";
  const bio =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis facilis optio laborum. Pariatur, optio nam laudantium et iste iure debitis.";
  const [values, setValue] = useState({
    username,
    bio,
  });
  const displaySaveButton = username !== values.username || bio !== values.bio;
  function handleChange(key: string, value: string) {
    setValue((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }
  const { theme, setTheme } = useTheme();
  async function handleSubmit(data: typeof values) {
    // some zod validation
    //send to endpoint
    // update store
    console.log(data);
  }
  return (
    <Sheet open={isOpen} onOpenChange={(open) => openDrawer(open)}>
      <SheetContent side={"left"} className="p-0">
        <SheetHeader className="w-full py-4 px-6 text-center bg-brand-p1 text-white text-2xl">
          Settings
        </SheetHeader>
        <div className="overflow-auto h-[calc(100%-64px)] relative">
          {displaySaveButton && (
            <Button
              onClick={() => handleSubmit(values)}
              className="absolute top-5 right-5 font-semibold text-[15.5px] px-6 bg-brand-p2 text-white"
            >
              Save
            </Button>
          )}
          <div className="px-5 space-y-5 mt-8">
            <img
              src={avatar2}
              alt="user's avatar"
              className="h-32 w-32 rounded-[50%] mx-auto object-cover border-2 border-slate-500  dark:border-slate-700"
            />
            <EditInput
              label="Username"
              defaultValue={values.username}
              onChange={handleChange}
            />
            <EditInput
              label="Bio"
              defaultValue={values.bio}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2 px-4 mt-10">
            {data.slice(0, 3).map((item) => (
              <SettingsItem 
              text={item.text} 
              Icon={item.icon} 
              key={uuidv4()} 
              />
            ))}
            <div className="flex items-center justify-between p-3 text-gray-600 font-medium">
              <P className="flex items-center gap-5">
                <span>
                  <MoonIcon />
                </span>{" "}
                <span>Dark Mode</span>
              </P>
              <Switch
                checked={theme === "dark"}
                value={theme}
                onCheckedChange={() => {
                  if (theme === "dark") {
                    setTheme("light");
                    return;
                  }
                  setTheme("dark");
                }}
              />
            </div>
            <div className="h-12"></div>
            {data.slice(3, 5).map((item) => (
              <SettingsItem
                text={item.text}
                Icon={item.icon}
                key={uuidv4()}
                danger={item.text === "Delete Account"}
              />
            ))}
          </div>
          <div className="mt-6">
            <P className="font-medium px-8 ">
              {" "}
              Version{" "}
              <span className="bg-neutral-200 text-black/80 ml-5 text-sm rounded-sm p-[0.45rem] font-mono font-light">
                1.0.0
              </span>{" "}
            </P>
            <footer className="bg-brand-p1 mt-7 w-full font-semibold text-white py-[0.45rem] text-center">
              <P>
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
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export default SettingsDrawer;
