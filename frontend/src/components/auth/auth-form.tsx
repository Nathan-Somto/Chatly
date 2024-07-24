import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputGroup from "../ui/input-group";
import { Button } from "../ui/button";
import TextAreaGroup from "../ui/textarea-group";
import toast from "react-hot-toast";
import * as z from "zod";
import { ImagePlusIcon} from "lucide-react";
import { useRef, useState } from "react";
import { useMutate } from "@/hooks/query/useMutate";
import { useNavigate } from "react-router-dom";
import { useProfileStore } from "@/hooks/useProfileStore";
import { AxiosResponse } from "axios";
import { displayError, uploadFile } from "@/lib/utils";
import AvatarUser from "../common/avatar-user";
type Props = {
    username: string;
    bio: string;
    avatar: string;
    id: string;
    clerkId: string;
    isOnboarded: boolean;
    email: string;
  handleModalClose?: () => void;
};
const schema = z.object({
  username: z.string().min(5).max(40),
  bio: z.string().min(10).max(500),
  avatar: z.string(),
});
type SchemaType = z.infer<typeof schema>;
function AuthForm({ username, bio, avatar, id, clerkId, email }: Props) {
  const navigate = useNavigate()
  const imageRef = useRef<null | HTMLInputElement>(null);
  const {setProfile} = useProfileStore();
  const [files, setFiles] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
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
 function onSuccess(response: AxiosResponse<any, any>) {
  console.log("response: ", response)
    const user = response.data.user;
    setProfile({
      avatar: user.avatar,
      bio: user.bio,
      clerkId: user.clerkId,
      email: user.email,
      id: user.id,
      isOnboarded: user.isOnboarded,
      username: user.username
    });
    navigate(`/${user.clerkId}/chats`);
    console.log(response);
  }
  const {mutate: postMutate, isPending: isPostPending} = useMutate({
    defaultMessage: "Failed to create user profile!",
    method: "post",
    route: "/users",
    onSuccess
  })
  const {mutate: putMutate, isPending: isPutPending} = useMutate({
    defaultMessage: "Failed to create user profile!",
    method: "patch",
    route: `/users`,
    onSuccess
  })
  
  async function onSubmit(data: SchemaType) {
    setIsUploading(true);
    try {
      if (files && imageRef.current && imageRef.current.files) {
        console.log("the file: ",imageRef.current.files[0]);
        const uploadedUrl = await uploadFile(imageRef.current.files[0]);
        if (uploadedUrl) {
          data.avatar = uploadedUrl;
        }
      }
      setIsUploading(false);
      console.log("on submit data: ",data);
      if(id === ''){
        postMutate({
          ...data,
          email,
          clerkId,
          isOnboarded: true
        })
      }
      else {
        putMutate({
          ...data,
          email,
          clerkId,
          isOnboarded: true
        })
      }
    }
    catch(err){
      toast.error(displayError(err, 'failed to create user profile!'))
    }
  }
  const disableBtn = isPostPending || isPutPending || isUploading;
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
       <AvatarUser src={files || avatar} alt="avatar preview" size={96} className="ring-brand-p2 ring-2"/>
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
          name="avatar"
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
      <Button className="min-w-full text-gray-100" size="lg" disabled={disableBtn}>
        {disableBtn ? "Creating..." :"Save"}
      </Button>
    </form>
  );
}

export default AuthForm;
