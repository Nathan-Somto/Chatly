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
import P from "@/components/ui/typo/P";
import EditInput from "./edit-input";
import SettingsItem from "./settings-item";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/wrappers/theme-provider";
import { useNavigate } from "react-router-dom";
import DeleteModal from "@/components/modals/delete-modal";
import GroupChatModal from "@/components/modals/groupchat-modal";
const data = [
  {
    text: "New Group chat",
    icon: GroupIcon,
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
] as const;

function SettingsDrawer({ isOpen, openDrawer }: DrawerProps) {
  const username = "@Nathan_Somto";
  const { theme, setTheme } = useTheme();
  const bio =
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Perspiciatis facilis optio laborum. Pariatur, optio nam laudantium et iste iure debitis.";
  const [values, setValue] = useState({
    username,
    bio,
  });
  const [modals, setModals] = useState({
    groupChat:false,
    deleteAccount:false
  })
  const displaySaveButton = username !== values.username || bio !== values.bio;
  const navigate = useNavigate();
  async function handleLogout(){
    // handle clerk logout
    // remove profile from store.
    // navigate to sign-in
    navigate('/sign-in');
  }
async function handleClick(item: typeof data[number]['text']){
    switch(item){
      case "New Group chat":
        setModals(prevState => ({
          ...prevState,
          groupChat: true
        }));
        return;
      case "Request Feature":
        window.open('https://www.github.com/nathan-somto/chatly/issues', '__blank')
        return;
      case "Logout":
        await handleLogout();
        return;
      case "Delete Account":
        setModals(prevState => ({
          ...prevState,
          deleteAccount: true
        }));
        return;
    }
  }
  function handleChange(key: string, value: string) {
    setValue((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }
  async function handleSubmit(data: typeof values) {
    // some zod validation
    // send to endpoint
    // update profile store
    console.log(data);
  }
  return (
    <>
    <GroupChatModal open={modals.groupChat}  setModals={setModals}/>
    <DeleteModal open={modals.deleteAccount} setModals={setModals}/>
    <Sheet open={isOpen} onOpenChange={(open) => openDrawer(open)}>
      <SheetContent side={"left"} className="p-0">
        <SheetHeader className="w-full py-2 h-14 px-6 text-center bg-brand-p1 dark:bg-[rgb(60,116,161)] text-gray-100 text-xl">
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
            {data.slice(0, 2).map((item) => (
              <SettingsItem 
              text={item.text} 
              Icon={item.icon} 
              key={uuidv4()}
              handleClick={handleClick} 
              />
            ))}
            <div className="flex items-center justify-between p-3 text-gray-600 dark:text-gray-100 font-medium">
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
            {data.slice(2, 4).map((item) => (
              <SettingsItem
                text={item.text}
                Icon={item.icon}
                key={uuidv4()}
                danger={item.text === "Delete Account"}
                handleClick={handleClick}
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
    </>
  );
}
export default SettingsDrawer;
