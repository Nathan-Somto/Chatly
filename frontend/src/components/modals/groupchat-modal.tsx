import { useForm } from "react-hook-form";
import { DialogContent, Dialog, DialogHeader } from "../ui/dialog";
import InputGroup from "../ui/input-group";
import TextAreaGroup from "../ui/textarea-group";
import Select from "react-select";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import H2 from "../ui/typo/H2";
import { Button } from "../ui/button";
import GroupIcon from "../drawers/settingsDrawer/GroupIcon";
import { customReactSelectStyles } from "@/constants";
import { useMutate } from "@/hooks/query/useMutate";
import useSocketStore from "@/hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/hooks/useProfile";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { useEffect, useState } from "react";
import { GetMembersInfoResponse } from "@/api-types";
import P from "../ui/typo/P";
import { useActiveChat } from "@/hooks/useActiveChat";
import { EyeOff } from "lucide-react";
import { Switch } from "../ui/switch";
import Small from "../ui/typo/Small";
import { cn } from "@/lib/utils";
type Props = {
  open: boolean;
  setModal: (value: boolean, isGroup: boolean) => void;
  isCreateGroup?: boolean;
  initialMemberIds?: string[];
};

const AddMembersSchema = z.object({
  members: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(1)
    .readonly(),
});
const createGroupChatSchema = AddMembersSchema.extend({
  name: z.string(),
  description: z
    .string()
    .min(8, "Description must be at least 8 characters")
    .max(500)
    .optional(),
  privacy: z.enum(["PRIVATE", "PUBLIC"]).default("PRIVATE"),
});

type AddMembersSchemaType = z.infer<typeof AddMembersSchema>;
type CreateGroupSchemaType = z.infer<typeof createGroupChatSchema>;

function GroupChatModal({
  open,
  setModal,
  isCreateGroup = true,
  initialMemberIds,
}: Props) {
  const schema = isCreateGroup ? createGroupChatSchema : AddMembersSchema;
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<AddMembersSchemaType | CreateGroupSchemaType>({
    resolver: zodResolver(schema),
  });
  const [memberOptions, setMemberOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { profile } = useProfileStore();
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { setActiveChat } = useActiveChat();
  const { data: response, isPending: isFetchingMembers } =
    useGetQuery<GetMembersInfoResponse>({
      enabled: isCreateGroup,
      route: "/users?memberInfo=true",
      queryKey: ["users"],
      defaultMessage: "Failed to fetch users",
    });
  const { mutate: createGroup, isPending: isCreating } = useMutate({
    route: "/chats/create-groupchat",
    method: "post",
    defaultMessage: "Failed to create group chat",
    onSuccess(response) {
      // join all the members to the room.
      members.forEach((member) => {
        socket?.emit("joinChat", {
          chatId: response.data?.groupChat?.id,
          userId: member.value,
        });
      });
      // emit the new message to the room.
      socket?.emit("sendMessage", {
        message: response.data?.firstMessage,
        chatInfo: response.data?.groupChat,
      });
      setModal(false, true);
      setActiveChat({
        groupInfo: {
          id: response.data?.groupChat?.id,
          isGroup: true,
          name: response.data?.groupChat?.name,
          avatars: response.data?.avatars,
          members: response.data?.members,
          description: response.data?.groupChat?.description,
          inviteCode: response.data?.groupChat?.inviteCode,
          privacy: response.data?.groupChat?.privacy,
        },
        dmInfo: null,
      });
      navigate(`/${profile?.id}/chats/${response.data?.groupChat?.id}`);
    },
  });
  useEffect(() => {
    if (response) {
      let selectValues = response.data?.users?.map((user) => ({
        label: user.username,
        value: user.id,
      }));
      if (initialMemberIds) {
        selectValues = selectValues.filter(
          (item) => !initialMemberIds.includes(item.value)
        );
      }
      setMemberOptions(selectValues);
    }
  }, [response, initialMemberIds]);
  const members = watch("members");
  const privacy = watch("privacy");
  async function onSubmit(data: AddMembersSchemaType | CreateGroupSchemaType) {
    console.log(data);
    try {
      if (isCreateGroup) {
        createGroup({
          ...data,
          members: [
            ...data.members,
            { label: profile?.username, value: profile?.id, isOwner: true },
          ],
          ownerName: profile?.username,
          ownerId: profile?.id,
        });
      }
    } catch (error) {}
    console.log(data);
  }
  return (
    <Dialog open={open} onOpenChange={(open) => setModal(open, true)}>
      <DialogContent
        className={cn(
          "h-[500px] overflow-auto  pb-5",
          !isCreateGroup && "h-[300px]"
        )}
      >
        <DialogHeader className="mt-2 flex items-center gap-x-2 flex-row">
          {" "}
          <GroupIcon size={28} />
          <H2 className="text-2xl">
            {isCreateGroup ? "New Group Chat" : "Add Members"}
          </H2>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {isCreateGroup && (
            <>
              <InputGroup
                label={"name"}
                errors={errors}
                id={"name"}
                register={register}
                type="text"
              />
              <TextAreaGroup
                label={"description"}
                errors={errors}
                id={"description"}
                register={register}
                height={10}
                width={50}
                className="max-h-[100px]"
              />
              <div className="flex items-center justify-between p-3 text-gray-600 dark:text-gray-100 font-medium">
                <P className="flex items-center gap-5">
                  <span>
                    <EyeOff size={20} />
                  </span>{" "}
                  <span>Make Group Private</span>
                </P>
                <Switch
                  checked={privacy === "PRIVATE"}
                  value={privacy}
                  onCheckedChange={() => {
                    if (privacy === "PRIVATE") {
                      setValue("privacy", "PUBLIC");
                      return;
                    }
                    setValue("privacy", "PRIVATE");
                  }}
                />
              </div>
              {privacy === "PUBLIC" && (
                <Small className="text-neutral-500 my-1.5">
                  Anyone can join this group without being added.
                </Small>
              )}
            </>
          )}
          <div>
            {isFetchingMembers ? (
              <div>
                <P>Fetching Members...</P>
              </div>
            ) : (
              <>
                <label htmlFor="members">Members</label>
                <Select
                  isMulti
                  name="members"
                  id="members"
                  options={memberOptions}
                  onChange={(value) => setValue("members", value)}
                  value={members}
                  className="text-foreground"
                  styles={customReactSelectStyles}
                />
              </>
            )}
          </div>
          <div className="flex items-center justify-end">
            <Button className="ml-auto px-8 py-3" disabled={isCreating}>
              {isCreating ? "Creating..." : isCreateGroup ? "Create" : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GroupChatModal;
