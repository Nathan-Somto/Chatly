import {
  ChangeRolePayload,
  EditGroupChatPayload,
  GetGroupMembersResponse,
  RemoveMemberPayload,
} from "@/api-types";
import { PrivacyType } from "@/components/chats";
import { Avatar } from "@/components/common/avatar";
import EditInput from "@/components/common/edit-input";
import UserGroupBox from "@/components/common/user-group-box";
import DeleteModal from "@/components/modals/delete-modal";
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
import { useActiveChat } from "@/hooks/useActiveChat";
import useChatStore from "@/hooks/useChats";
import { useMessages } from "@/hooks/useMessages";
import { useProfileStore } from "@/hooks/useProfile";
import useSocketStore from "@/hooks/useSocket";
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
  imageUrl: string | null;
  name: string;
  description: string;
  inviteCode: string;
  privacyType?: PrivacyType;
  closeDrawer: () => void;
};
export default function GroupChatContents({
  imageUrl,
  privacyType,
  inviteCode,
  closeDrawer,
  description = "No Description Provided!",
  name = "No Groupchat name",
}: Props) {
  const { profile } = useProfileStore();
  const { chatId } = useParams();
  const { socket } = useSocketStore();
  const { activeChat, reset: resetActiveChat } = useActiveChat();
  const { removeChat } = useChatStore();
  const { setMessages } = useMessages();
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
  const [deleteModal, setDeleteModal] = useState(false);
  const [initialMemberIds, setInitialMembersIds] = useState<string[]>([]);
  const prevUserRole = useRef<{ index: number; role: Role }>({
    index: -1,
    role: "MEMBER",
  });
  const navigate = useNavigate();
  const removedUserRef = useRef<(UserBox & { index: number }) | null>(null);
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
  // change member role
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
  // member leave
  const { mutate: leaveChat, isPending: isLeavingChat } = useMutate({
    route: `/chats/${chatId}/leave`,
    method: "patch",
    displayToast: true,
    defaultMessage: "Failed to leave chat",
    onSuccess(response) {
      // broadcast the message from the response to other users
      socket?.emit("newMessage", {
        message: response.data?.leftMessage,
        chatInfo: activeChat?.groupInfo,
      });
      // disconnect from listening to messages from the chat
      socket?.emit("leaveChat", { chatId, userId: profile?.id });
    },
  });
  // member remove
  const { mutate: removeMember, isPending: isRemovingMember } =
    useMutate<RemoveMemberPayload>({
      route: `/chats/${chatId}/remove-member`,
      method: "patch",
      displayToast: true,
      defaultMessage: "Failed to remove member",
      onSuccess(response) {
        // broadcast the message from the response to other users
        socket?.emit("newMessage", {
          message: response.data?.removedMessage,
          chatInfo: activeChat?.groupInfo,
        });
        // remove the chat from the other user's chatlist
        socket?.emit("leaveChat", {
          userId: response.data?.removedMemberId,
          chatId,
        });
      },
      onError() {
        // reset the user to the list
        if (removedUserRef.current) {
          const localUsersCopy = localUsers?.slice() ?? [];
          localUsersCopy.splice(
            removedUserRef.current.index,
            0,
            removedUserRef.current
          );
          setLocalUsers(localUsersCopy);
          // set the ref back to null
          removedUserRef.current = null;
        }
      },
    });
  // delete group chat
  const { mutate: deleteGroupChat, isPending: isDeleting } =
    useMutate<undefined>({
      route: `/chats/${chatId}/group-chat`,
      method: "delete",
      displayToast: true,
      defaultMessage: "Failed to delete group chat",
      onSuccess() {
        // remove the chat from the chatlist
        if (chatId) {
          removeChat(chatId);
        }
        // remove everyone from the chat room
        localUsers?.forEach((user) => {
          socket?.emit("leaveChat", { userId: user.id, chatId });
        });
        setMessages([]);
        // remove the chat from the active chat
        resetActiveChat();
        closeDrawer();
        // navigate to user chats screen
        navigate(`/${profile?.id}/chats`);
        // done by the page automatically
      },
    });
  // update group chat details
  const { mutate: updateGroupChat, isPending: isUpdating } =
    useMutate<EditGroupChatPayload>({
      route: `/chats/${chatId}/group-chat`,
      method: "patch",
      displayToast: true,
      defaultMessage: "Failed to update group chat",
      onSuccess() {
        // update the chatlist
        queryClient.invalidateQueries({ queryKey: ["chats"], exact: true });
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
      setInitialMembersIds(data.chatMembers.map((item) => item.id));
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
  function toggleGroupChatModal(value: boolean, _isGroup: boolean) {
    setGroupChatModal(value);
  }
  function toggleDeleteModal(value: boolean) {
    setDeleteModal(value);
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
    if (!data?.privacyType) return;
    updateGroupChat(data as unknown as EditGroupChatPayload);
  }
  async function handleRemove(data: RemoveMemberPayload, index: number) {
    // if no profile return (defensive programming)
    if (!profile) return;
    // optimistcally remove the user from the list
    const localUsersCopy = localUsers?.slice() ?? [];
    const removedUser = localUsersCopy[index];
    removedUserRef.current = { ...removedUser, index };
    localUsersCopy.splice(index, 1);
    setLocalUsers(localUsersCopy);
    removeMember(data);
  }
  async function handleLeave() {
    leaveChat({ username: profile?.username });
  }
  async function handleDelete() {
    deleteGroupChat();
  }
  const disableBtn =
    isLeavingChat ||
    isChangingRole ||
    isLoading ||
    isFetchingMembers ||
    isRemovingMember ||
    isUpdating;
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
        initialMemberIds={initialMemberIds}
      />
      <DeleteModal
        isPending={isDeleting}
        open={deleteModal}
        title="Delete Group Chat"
        deleteFn={handleDelete}
        message="Are you sure you want to delete this group chat?"
        onOpenChange={toggleDeleteModal}
      />
      <div className="relative">
        {displaySaveButton && (
          <Button
            disabled={disableBtn}
            onClick={() => handleSubmit(values)}
            className="absolute -top-2 right-5 font-semibold text-[15.5px] px-6 bg-brand-p2 text-white"
          >
            {isUpdating ? "Saving..." : "Save"}
          </Button>
        )}
        <header className="border-b mb-5 mt-6 pb-3">
          <div className="mx-auto w-fit mb-3">
            <Avatar type="Group" src={imageUrl ?? null} size={120} />
          </div>
          {isFetchingMembers ? (
            <div className="bg-[#383A47] dark:gray-300 h-5 w-8 rounded-sm mt-1.5 animate-ping"></div>
          ) : (
            <P className="opacity-80 text-xs font-medium mt-1.5 text-[#383A47] dark:text-gray-300">
              {`${localUsers?.length ?? 0}${" "}Member${
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
          {localUsers !== null && (
            <Button
              variant="outline"
              className="w-full justify-start gap-x-2"
              onClick={() => toggleGroupChatModal(true, true)}
            >
              <UserPlus2Icon size={20} />
              Add Members
            </Button>
          )}
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
                      disable={profile?.id === user.id}
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
                            disabled={disableBtn}
                          >
                            <div className="flex items-center">
                              <ShieldCheckIcon size={20} className="mr-2" />
                              {user.role !== "ADMIN"
                                ? "Make "
                                : "Remove as "}{" "}
                              Admin
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={disableBtn}
                            onClick={() =>
                              handleRemove(
                                {
                                  targetUserId: user.id,
                                  adminUsername: profile?.username ?? "",
                                  targetUsername: user.username,
                                  userId: profile?.id ?? "",
                                },
                                index
                              )
                            }
                          >
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
            disabled={disableBtn}
            className=" mt-5 w-full justify-start"
          >
            {isLeavingChat ? (
              <Loader size="sm" withBackground={false} />
            ) : (
              <>
                <LogOutIcon size={20} className="mr-2" /> Leave
              </>
            )}
          </Button>
        </div>
        {isOwner && (
          <Button
            onClick={() => toggleDeleteModal(true)}
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
