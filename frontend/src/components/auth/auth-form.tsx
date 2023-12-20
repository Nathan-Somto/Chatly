import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputGroup from "../ui/input-group";
import { Button } from "../ui/button";
import TextAreaGroup from "../ui/textarea-group";
import toast from "react-hot-toast";
import * as z from "zod";
type Props = {
  username: string;
  bio: string;
  avatar: string;
  handleModalClose?: () => void;
};
const schema = z.object({
  username: z.string().min(5).max(40),
  bio: z.string().min(10).max(500),
  avatar: z.string(),
});
type SchemaType = z.infer<typeof schema>;
function AuthForm({ username, bio, avatar }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      username,
      bio,
      avatar,
    },
  });
  function onSubmit(data: SchemaType) {
    console.log(data);
    setTimeout(() => {
        toast.success("successfully submitted user data!")
    }, 3000)
  }
  return (
    <form
      className="space-y-6 text-sm md:text-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <figure className="flex items-center gap-5  text-sm flex-wrap flex-shrink-0">
        <img
          src={avatar}
          alt="avatar preview"
          className="ring-2 h-16 w-16 ring-brand-p1 rounded-[50%]"
        />
        <input type="file" {...register("avatar")} id="avatar" />
      </figure>
      <InputGroup<SchemaType, "username">
        errors={errors}
        id="username"
        label="username"
        register={register}
        type="text"
      />
      <TextAreaGroup<SchemaType, "bio">
        errors={errors}
        id="bio"
        label="bio"
        height={30}
        width={30}
        register={register}
        className={"w-full h-[200px]"}
      />
      <div className="flex items-center justify-end">
        <Button className="max-w-fit" size="lg">
          Save
        </Button>
      </div>
    </form>
  );
}

export default AuthForm;
