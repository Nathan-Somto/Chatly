import { ChangeRolePayload, GetGroupMembersResponse } from "@/api-types";
import { PrivacyType } from "@/components/chats";
import AvatarGroup from "@/components/common/avatar-group";
import EditInput from "@/components/common/edit-input";
import UserGroupBox from "@/components/common/user-group-box";
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
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useMutate } from "@/hooks/query/useMutate";
import { useProfileStore } from "@/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import {
  EyeOff,
  LogOutIcon,
  MoreHorizontal,
  ShieldCheckIcon,
  Trash2Icon,
  UserPlus2Icon,
  UsersIcon,
  XCircleIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
type Props = {
  avatars: string[];
  name: string;
  description: string;
  inviteCode: string;
  privacyType?: PrivacyType;
};
//@Todo: handle member leave, member remove, group chat delete, group chat update
export default function GroupChatContents({
  avatars,
  privacyType,
  inviteCode,
  description = "No Description Provided!",
  name = "No Groupchat name",
}: Props) {
  const { profile } = useProfileStore();
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [canEdit, setCanEdit] = useState(false);
  const [localUsers, setLocalUsers] = useState<null | UserBox[]>(null);
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
  const prevUserRole = useRef<{ index: number; role: Role }>({
    index: -1,
    role: "MEMBER",
  });
  const queryClient = useQueryClient();
  const displaySaveButton =
    name !== values.name ||
    description !== values.description ||
    privacyType !== values.privacyType;
  // fetch the group chat members
  const { data: membersResponse, isPending: isFetchingMembers } =
    useGetQuery<GetGroupMembersResponse>({
      enabled: true,
      queryKey: ["members", chatId],
      route: `/chats/${chatId}/members`,
      displayToast: false,
    });
  const { mutate: changeRole, isPending: isChangingRole } =
    useMutate<ChangeRolePayload>({
      route: `/chats/${chatId}/change-role`,
      method: "patch",
      displayToast: true,
      onSuccess() {
        // reset the ref
        resetPrevUserRef();
        queryClient.invalidateQueries({
          queryKey: ["members", chatId],
          exact: true,
        });
      },
      onError() {
        // find the user and reset to prev role.
        if (!localUsers) return;
        const { index, role } = prevUserRole.current;
        const localUsersCopy = localUsers?.slice();
        localUsersCopy[index].role = role;
        setLocalUsers(localUsersCopy);
      },
    });
  useEffect(() => {
    const data = membersResponse?.data;
    if (data) {
      // find the logged in user and determine if they can edit or they are an Owner
      const user = data.chatMembers.find((user) => user.id === profile?.id);
      if (user) {
        if (user.role === "OWNER") {
          setIsOwner(true);
          setCanEdit(true);
        } else if (user.role === "ADMIN") {
          setCanEdit(true);
        }
      } else {
        setCanEdit(false);
        setIsOwner(false);
      }
      setLocalUsers(data.chatMembers);
    }
  }, [membersResponse]);
  function resetPrevUserRef() {
    prevUserRole.current = {
      index: -1,
      role: "MEMBER",
    };
  }
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
  function toggleRole(targetUserId: string, index: number, role: Role) {
    if (!profile?.id) return;
    const localUsersCopy = localUsers?.slice() ?? [];
    prevUserRole.current = {
      index,
      role,
    };
    if (role === "MEMBER") {
      localUsersCopy[index].role = "ADMIN";
    } else {
      localUsersCopy[index].role = "MEMBER";
    }
    setLocalUsers(localUsersCopy);
    changeRole({
      adminId: profile.id,
      role,
      targetUserId,
    });
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
            <AvatarGroup avatars={avatars} size={120} />
          </div>
          {isFetchingMembers ? (
            <div className="bg-[#383A47] dark:gray-300 h-5 w-8 rounded-sm mt-1.5 animate-ping"></div>
          ) : (
            <P className="opacity-80 text-xs font-medium mt-1.5 text-[#383A47] dark:text-gray-300">
              {`${localUsers?.length ?? 0}${' '}Member${
                (localUsers?.length ?? 0) > 1 ? "s" : ""
              } `}
            </P>
          )}

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
          {canEdit && values.privacyType && (
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
            {localUsers !== null ? (
              localUsers.length > 0 ? (
                localUsers.map((user, index) => (
                  <div className="flex  items-center gap-x-2" key={user.id}>
                    <UserGroupBox
                      type="user"
                      {...user}
                      showRole
                      toggleLoading={toggleLoading}
                    />
                    {canEdit && user.role !== "OWNER" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant={"ghost"}
                            className="text-brand-p2 hover:bg-transparent !p-0"
                            size="icon"
                            disabled={isChangingRole}
                          >
                            <MoreHorizontal size={25} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="py-4">
                          <DropdownMenuItem
                            className="gap-x-5"
                            onClick={() =>
                              toggleRole(user.id, index, user.role ?? "MEMBER")
                            }
                          >
                            <div className="flex items-center">
                              <ShieldCheckIcon size={20} className="mr-2" />
                              {user.role !== "ADMIN"
                                ? "Make "
                                : "Remove as "}{" "}
                              Admin
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
                ))
              ) : (
                <div>
                  <P>No members yet! </P>
                </div>
              )
            ) : (
              isFetchingMembers && (
                <div>
                  {" "}
                  <Loader withBackground={false} size={"sm"} />{" "}
                </div>
              )
            )}
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
