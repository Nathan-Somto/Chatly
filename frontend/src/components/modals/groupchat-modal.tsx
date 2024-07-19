import { useForm } from "react-hook-form";
import { DialogContent, Dialog, DialogHeader } from "../ui/dialog";
import InputGroup from "../ui/input-group";
import TextAreaGroup from "../ui/textarea-group";
import Select from "react-select";
import { v4 as uuidv4 } from "uuid";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import H2 from "../ui/typo/H2";
import { Button } from "../ui/button";
import GroupIcon from "../drawers/settingsDrawer/GroupIcon";
import { customReactSelectStyles } from "@/constants";
type Props = {
  open: boolean;
  setModal: (value: boolean, isGroup: boolean) => void;
  isCreateGroup?: boolean;
};
const memberOptions = [
  {
    label: "jane",
    value: uuidv4(),
  },
  {
    label: "mccolum",
    value: uuidv4(),
  },
  {
    label: "peter",
    value: uuidv4(),
  },
  {
    label: "gustavo",
    value: uuidv4(),
  },
  {
    label: "veronica",
    value: uuidv4(),
  },
  {
    label: "mercy",
    value: uuidv4(),
  },
  {
    label: "angel",
    value: uuidv4(),
  },
  {
    label: "maria",
    value: uuidv4(),
  },
  {
    label: "phillips",
    value: uuidv4(),
  },
] as const;
const AddMembersSchema = z.object({
  members: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
    })
  ).min(2).readonly(),
});

const createGroupChatSchema = AddMembersSchema.extend({
  name: z.string(),
  description: z.string().min(8, "Description must be at least 8 characters").max(500).optional(),
});

type AddMembersSchemaType = z.infer<typeof AddMembersSchema>;
type CreateGroupSchemaType = z.infer<typeof createGroupChatSchema>;


function GroupChatModal({ open, setModal, isCreateGroup=true }: Props) {
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
  const members = watch("members");
  function onSubmit(data: AddMembersSchemaType | CreateGroupSchemaType) {
    console.log(data);
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        setModal(open, true)
      }
    >
      <DialogContent className="h-[450px] overflow-auto  pb-5">
        <DialogHeader className="mt-2 flex items-center gap-x-2 flex-row">
          {" "}
          <GroupIcon size={28}/>
          <H2 className="text-2xl">{isCreateGroup ? "New Group Chat" : "Add Members"}</H2>
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
            </>
          )}
          <div>
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
          </div>
          <div className="flex items-center justify-end">
            <Button className="ml-auto px-8 py-3">{isCreateGroup ? "Create" : "Add"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GroupChatModal;
