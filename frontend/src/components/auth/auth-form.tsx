import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputGroup from "../ui/input-group";
import { Button } from "../ui/button";
import TextAreaGroup from "../ui/textarea-group";
import toast from "react-hot-toast";
import * as z from "zod";
import { CameraIcon, ImagePlusIcon, User } from "lucide-react";
import { useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
  const imageRef = useRef<null | HTMLInputElement>(null);
  const [files, setFiles] = useState<string>("");
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
  /* const mutatation = useMutation({
    mutationFn: (data) =>{

    }
  }) */
  function onSubmit(data: SchemaType) {
    data.avatar = files;
    console.log(data);
    setTimeout(() => {
      toast.success("successfully submitted user data!");
    }, 3000);
  }
  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      if (!e.target.files[0].type.includes("image")) {
        toast.error("only image files are allowed!");
        return;
      }
      //setFiles(Array.from(e.target.files));
      file.onload = async (fileEvt) => {
        setFiles(fileEvt?.target?.result?.toString() ?? "");
      };
      file.readAsDataURL(e.target.files[0]);
    }
  }

  return (
    <form
      className="space-y-4 text-sm md:text-lg"
      onSubmit={handleSubmit(onSubmit)}
    >
      <figure className="flex items-center gap-2 mx-auto relative h-24 w-24 text-sm flex-wrap justify-center flex-shrink-0">
        {files || avatar.length > 0 ? (
          <img
            src={files || avatar}
            alt="avatar preview"
            className="ring-2 h-full w-full ring-brand-p1 rounded-[50%] object-cover"
          />
        ) : (
          <User className="ring-2 h-full w-full ring-brand-p1 rounded-[50%] text-gray-500 p-2" />
        )}
        <Button
          type="button"
          className="absolute -bottom-2 h-9 w-9 z-[3] right-0"
          variant="outline"
          onClick={() => imageRef.current?.click()}
        >
          <ImagePlusIcon className="h-6 w-6 flex-shrink-0" />
          <span className="sr-only">Upload Image</span>
        </Button>
        <input
          type="file"
          id="avatar"
          onChange={handleImage}
          accept="image/*"
          hidden
          ref={imageRef}
          max={1}
        />
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
        className={"w-full h-[100px]"}
      />
      <Button className="min-w-full text-gray-100" size="lg">
        Save
      </Button>
    </form>
  );
}

export default AuthForm;
