// @ts-nocheck
// cloudinary upload widget that takes a custom button and uploads the image to cloudinary
// returning the image url/ video url
import React from "react";
type UploadWidgetProps = {
  children: React.ReactElement;
  onUploadComplete: (url: string, resource_type: "image" | "video") => void;
  onError: (error: any) => void;
};
export default function UploadWidget({
  children,
  onUploadComplete,
  onError,
}: UploadWidgetProps) {
  const cloudinaryRef = React.useRef(null);
  const UploadWidgetRef = React.useRef(null);
  React.useEffect(() => {
    cloudinaryRef.current = window.cloudinary;
    UploadWidgetRef.current = cloudinaryRef.current?.createUploadWidget(
      {
        cloudName: "dvw2zx08k",
        uploadPreset: "u_default",
        folder: "media/chats",
      },
      (err, result) => {
        console.log(result, err)
        if (result?.event === "success") {
          onUploadComplete(result.info.secure_url, result.info.resource_type);
        }
        if (err) {
          onError(err);
        }
      }
    );
  }, []);
  const openWidget = () => {
    UploadWidgetRef.current.open();
  };
  const CompWithOnClick = React.cloneElement(children, { onClick: openWidget });
  return <>{CompWithOnClick}</>;
}
