import { SheetContent, SheetHeader, Sheet } from "@/components/ui/sheet";
import { MoonIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import P from "@/components/ui/typo/P";
import EditInput from "../../common/edit-input";
import SettingsItem, { SettingsText } from "./settings-item";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/wrappers/theme-provider";
import DeleteModal from "@/components/modals/delete-modal";
import GroupChatModal from "@/components/modals/groupchat-modal";
import { useProfileStore } from "@/hooks/useProfile";
import { Avatar } from "@/components/common/avatar";
import { useMutate } from "@/hooks/query/useMutate";
import { useQueryClient } from "@tanstack/react-query";
import { settingsItemData } from "@/constants";
import { useLogout } from "@/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { GetResponse } from "@/hooks/query";
import { GetUserResponse } from "@/api-types";

function SettingsDrawer({ isOpen, openDrawer }: DrawerProps) {
  const queryClient = useQueryClient();
  const { profile, updateProfile: updateProfileStore } = useProfileStore();
  const { handleLogout } = useLogout({ isHomePage: false });
  const { theme, setTheme } = useTheme();
  const username = useRef(profile?.username);
  const bio = useRef(profile?.bio);
  const navigate = useNavigate();
  const [values, setValue] = useState({
    username: "@" + profile?.username || "",
    bio: profile?.bio || "",
  });
  const [modals, setModals] = useState({
    groupChat: false,
    deleteAccount: false,
  });
  const { mutate: deleteUser, isPending: isDeleting } = useMutate<undefined>({
    method: "delete",
    route: "/users",
  });
  const { mutate: updateProfile, isPending: isUpdating } = useMutate({
    method: "patch",
    route: "/users",
    onSuccess() {
      username.current = values.username.slice(1);
      bio.current = values.bio;
      queryClient.setQueryData(
        ["profile"],
        (_oldData: GetResponse<GetUserResponse>) => {
          return {
            data: {
              user: {
                ...profile,
                username: values.username,
                bio: values.bio
              },
            },
          };
        }
      );
      updateProfileStore({
        username: values.username.slice(1),
        bio: values.bio,
      });
    },
  });
  const displaySaveButton =
    username.current !== values.username.slice(1) || bio.current !== values.bio;
  const disableSaveButton = isUpdating || isDeleting;
  async function handleClick(item: SettingsText) {
    switch (item) {
      case "New Group chat":
        setModals((prevState) => ({
          ...prevState,
          groupChat: true,
        }));
        return;
      case "Request Feature":
        window.open(
          "https://www.github.com/nathan-somto/chatly/issues",
          "__blank"
        );
        return;
      case "Logout":
        await handleLogout();
        return;
      case "Delete Account":
        setModals((prevState) => ({
          ...prevState,
          deleteAccount: true,
        }));
        return;
      case "Change Wallpaper":
        navigate(`/${profile?.id}/wallpaper`);
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
    // some  validation
    if (!data.username || !data.bio) return;
    // send to endpoint
    data.username = data.username.slice(1);
    updateProfile(data);
    console.log(data);
  }
  async function handleDelete() {
    deleteUser();
  }
  function setModal(value: boolean) {
    setModals((prevState) => ({
      ...prevState,
      groupChat: value,
    }));
  }
  return (
    <>
      <GroupChatModal open={modals.groupChat} setModal={setModal} />
      <DeleteModal
        open={modals.deleteAccount}
        deleteFn={handleDelete}
        isPending={isDeleting}
        onOpenChange={(value) => {
          setModals((prevState) => ({
            ...prevState,
            deleteAccount: value,
          }));
        }}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
      <Sheet open={isOpen} onOpenChange={(open) => openDrawer(open)}>
        <SheetContent side={"left"} className="p-0">
          <SheetHeader className="w-full py-2 h-14 px-6 text-center bg-brand-p1 dark:bg-[rgb(60,116,161)] text-gray-100 text-xl">
            Settings
          </SheetHeader>
          <div className="overflow-auto h-[calc(100%-64px)] relative">
            {displaySaveButton && (
              <Button
                onClick={() => handleSubmit(values)}
                disabled={disableSaveButton}
                className="absolute top-5 right-5 font-semibold text-[15.5px] px-6 bg-brand-p2 text-white"
              >
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            )}
            <div className="px-5 space-y-5 mt-8 border-b-2 mb-5 pb-3">
              <Avatar type="User" src={profile?.avatar ?? null} size={128} />
              <EditInput
                label="Username"
                defaultValue={values.username}
                onChange={handleChange}
                isLinkable
              />
              <EditInput
                label="Bio"
                defaultValue={values.bio}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2 px-4 mt-10">
              {settingsItemData.slice(0, 3).map((item) => (
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
              {settingsItemData.slice(3, 5).map((item) => (
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
