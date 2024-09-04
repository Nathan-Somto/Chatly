import { Avatar } from "@/components/common/avatar";
import { uploadFile } from "@/lib/utils";
import { useState } from "react";
import { CameraIcon } from "lucide-react";
type AvatarUploaderComponentProps = {
  type?: "Group" | "User";
};
type UseAvatarUploaderResult = {
  AvatarUploaderComponent: React.FC<AvatarUploaderComponentProps>;
  uploadAvatar: () => Promise<string | null>;
};
export function useAvatarUploader(
  initialSrc: string | null,
  size = 64
): UseAvatarUploaderResult {
  const [imageUrl, setImageUrl] = useState<string | null>(initialSrc);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!selectedFile) return null;
    return await uploadFile(selectedFile);
  };
  const AvatarUploaderComponent: React.FC<AvatarUploaderComponentProps> = ({
    type = "User",
  }) => (
    <label
      className="relative cursor-pointer block mx-auto max-w-fit max-h-fit"
      style={{ width: size, height: size }}
    >
      <Avatar src={imageUrl} type={type} size={size} />
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="absolute -bottom-2 -right-2 rounded-full p-2 h-8 w-8 bg-primary flex items-center justify-center">
        <CameraIcon className="w-6 h-6 text-white opacity-75" />
      </div>
    </label>
  );

  return {
    AvatarUploaderComponent,
    uploadAvatar,
  };
}
