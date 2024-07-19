import AvatarGroup from "@/components/common/avatar-group";
import EditInput from "@/components/common/edit-input";
import UserBox from "@/components/common/user-box";
import GroupChatModal from "@/components/modals/groupchat-modal";
import { InviteModal } from "@/components/modals/invite-modal";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Loader from "@/components/ui/loader";
import { Switch } from "@/components/ui/switch";
import H3 from "@/components/ui/typo/H3";
import P from "@/components/ui/typo/P";
import {
  EyeOff,
  LogOutIcon,
  MoreHorizontal,
  ShieldCheckIcon,
  Trash2Icon,
  UserPlus2,
  UserPlus2Icon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
type PrivacyType = "PUBLC" | "PRIVATE";
type Props = {
  members: {
    user: {
      username: string;
      avatar: string;
    };
  }[];
  isOwner: boolean;
  canEdit: boolean;
  name: string;
  memberCount: number;
  description: string;
  inviteCode: string;
  privacyType: PrivacyType;
  users: UserBox[];
};
export default function GroupChatContents({
  members,
  memberCount,
  canEdit,
  privacyType,
  users,
  inviteCode,
  description = "a group chat for all the fun and parties!",
  name = "some random ass group chat!",
  isOwner,
}: Props) {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [localUsers, setLocalUsers] = useState(users);
  const [values, setValue] = useState({
    name,
    description,
    privacyType,
  });
  const [inviteData, setIniviteData] = useState({
    open: false,
    link: `invite-link/${chatId}/${inviteCode}`,
  });
  const [groupChatModal, setGroupChatModal] = useState(false);
  const displaySaveButton =
    name !== values.name ||
    description !== values.description ||
    privacyType !== values.privacyType;
  function handleChange(key: string, value: string) {
    setValue((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  }
  function toggleInviteModal(value: boolean) {
    setIniviteData((prevState) => ({
      ...prevState,
      open: value,
    }));
  }
  function toggleGroupChatModal(value: boolean, isGroup: boolean) {
    setGroupChatModal(value);
    console.log(isGroup);
  }
  function toggleLoading(value: boolean) {
    setIsLoading(value);
  }
  function makeAdmin(index: number, role: Role) {
    const localUsersCopy = localUsers.slice()
    if (role === "MEMBER") {
      localUsersCopy[index].role = "ADMIN";
    }
    else{
      localUsersCopy[index].role = "MEMBER";
    }
    setLocalUsers(localUsersCopy);
  }
  async function handleSubmit(data: typeof values) {
    console.log(data);
  }
  function handleLeave() {
    navigate(`/user1/chats`);
  }
  return (
    <>
      <InviteModal
        open={inviteData.open}
        inviteLink={inviteData.link}
        setVisiblity={toggleInviteModal}
      />
      <GroupChatModal
        open={groupChatModal}
        isCreateGroup={false}
        setModal={toggleGroupChatModal}
      />
      <div className="relative">
        {displaySaveButton && (
          <Button
            onClick={() => handleSubmit(values)}
            className="absolute -top-2 right-5 font-semibold text-[15.5px] px-6 bg-brand-p2 text-white"
          >
            Save
          </Button>
        )}
        <header className="border-b mb-5 mt-6 pb-3">
          <div className="mx-auto w-fit mb-3">
            <AvatarGroup members={members} size={120} />
          </div>
          <P className="opacity-80 text-xs font-medium mt-1.5 text-[#383A47] dark:text-gray-300">
            {memberCount} Member{memberCount > 1 ? "s" : ""}
          </P>
          <div className="">
            <EditInput
              label="name"
              isEditable={canEdit}
              defaultValue={values.name}
              onChange={handleChange}
              inputClassName="text-xl font-semibold p-0"
              labelClassName="!text-neutral-600"
            />
            <EditInput
              label="description"
              isEditable={canEdit}
              defaultValue={values.description}
              inputClassName="p-0"
              labelClassName="!text-neutral-600"
              onChange={handleChange}
            />
          </div>
        </header>
        <div className="space-y-4">
          {canEdit && (
          <div className="flex items-center justify-between p-3 text-gray-600 dark:text-gray-100 font-medium">
            <P className="flex items-center gap-5">
              <span>
                <EyeOff size={20} />
              </span>{" "}
              <span>Make Group Private</span>
            </P>
            <Switch
              checked={values.privacyType === "PRIVATE"}
              value={values.privacyType}
              onCheckedChange={() => {
                if (values.privacyType === "PRIVATE") {
                  handleChange("privacyType", "PUBLIC");
                  return;
                }
                handleChange("privacyType", "PRIVATE");
              }}
            />
          </div>
          )}
          <Button
            variant="outline"
            className="w-full justify-start gap-x-2"
            onClick={() => toggleInviteModal(true)}
          >
            <UsersIcon size={20} /> Get Invite Link
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start gap-x-2"
            onClick={() => toggleGroupChatModal(true, true)}
          >
            <UserPlus2Icon size={20} />
            Add Members
          </Button>
          <div>
            <H3 className="text-lg mt-4 mb-2">Members</H3>
            {/* Members list comes here! */}
            {localUsers.map((user, index) => (
              <div className="flex items-center gap-x-2" key={user.id}>
                <UserBox {...user} showRole toggleLoading={toggleLoading} />
                {canEdit && user.role !== "OWNER" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className=" hidden lg:block text-brand-p2 hover:bg-transparent !p-0"
                        size="icon"
                      >
                        <MoreHorizontal size={25} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="py-4">
                      <DropdownMenuItem
                        className="gap-x-5"
                        onClick={() => makeAdmin(index, user.role ?? "MEMBER")}
                      >
                        <div className="flex items-center">
                          <ShieldCheckIcon size={20} className="mr-2" />
                          {user.role !== "ADMIN" ? "Make " : "Remove as "} Admin
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <XCircleIcon size={20} className="mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
          <Button
            onClick={handleLeave}
            variant={"outline"}
            className=" mt-5 w-full justify-start"
          >
            <LogOutIcon size={20} className="mr-2" /> Leave
          </Button>
        </div>
        {isOwner && (
          <Button
            variant={"outline"}
            className="text-destructive w-full justify-start mt-3"
          >
            <Trash2Icon size={20} className="mr-2" /> Delete Group Chat
          </Button>
        )}
        {isLoading && <Loader />}
      </div>
    </>
  );
}
