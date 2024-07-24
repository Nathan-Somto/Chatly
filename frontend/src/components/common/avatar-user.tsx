import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React, { useState } from "react";

type Props = {
  src: string | null;
  size?: number;
  alt?: string;
  className?: string;
};

export default function AvatarUser({
  src,
  className = "",
  size = 32,
  alt = "user's avatar",
}: Props) {
  const [imgError, setImgError] = useState(false);

  const handleError = () => {
    setImgError(true);
  };

  return (
    <figure>
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          style={{ height: `${size}px`, width: `${size}px` }}
          className={cn(
            `rounded-[50%] mx-auto object-cover border-2 border-slate-500 dark:border-slate-700`,
            className
          )}
          onError={handleError}
        />
      ) : (
        <User
          size={size}
          className={cn(
            `rounded-[50%] p-1 mx-auto object-cover border-2 border-slate-500 dark:border-slate-700`,
            className
          )}
        />
      )}
    </figure>
  );
}

