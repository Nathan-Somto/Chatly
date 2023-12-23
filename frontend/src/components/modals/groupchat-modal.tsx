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
type Props = {
  open: boolean;
  setModals: React.Dispatch<
    React.SetStateAction<{
      groupChat: boolean;
      deleteAccount: boolean;
    }>
  >;
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
const schema = z.object({
  name: z.string(),
  description: z.string().min(8).max(500).optional(),
  members: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .min(2).readonly(),
});
type SchemaType = z.infer<typeof schema>;
function GroupChatModal({ open, setModals }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
  });
  const members = watch("members");
  function onSubmit(data: SchemaType) {
    console.log(data);
    setModals((prevState) => ({
      ...prevState,
      groupChat: false,
    }));
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        setModals((prevState) => ({
          ...prevState,
          groupChat: open,
        }))
      }
    >
      <DialogContent className="h-[450px] overflow-auto  pb-5">
        <DialogHeader className="mt-2">
          {" "}
          <H2 className="text-2xl">New Group Chat</H2>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
          <div>
            <label htmlFor="members">Members</label>
            <Select
              isMulti
              name="members"
              id="members"
              options={memberOptions}
              onChange={(value) => setValue("members", value)}
              value={members}
            />
          </div>
          <div className="flex items-center justify-end">
            <Button className="ml-auto px-8 py-3">Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default GroupChatModal;
