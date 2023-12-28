import { cn } from "@/lib/utils";
import React from 'react'
import {LucideIcon} from "lucide-react"
import P from "@/components/ui/typo/P";
type SettingsItemProps = {
    text: "New Group chat" | "Request Feature" | "Logout" | "Delete Account";
    Icon:({ size, ...props }: {
      size?: number | undefined;
  } & React.SVGProps<SVGSVGElement>) => JSX.Element | LucideIcon;
    size?: number;
    handleClick?: (item: "New Group chat" | "Request Feature" | "Logout" | "Delete Account") => Promise<void>;
    danger?: boolean;
  };
  function SettingsItem({
    text,
    Icon,
    size = 25,
    handleClick,
    danger,
  }: SettingsItemProps) {
    return (
      <div
        className="p-3 rounded-lg  w-full  flex items-center gap-5
      dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-300"
        role="button"
        onClick={() => (handleClick ? handleClick(text) : null)}
      >
        {typeof Icon === "string" ? (
          <img
            src={Icon}
            alt="icon"
            className=""
            style={{ height: size, width: size }}
          />
        ) : (
          <Icon
            size={size}
            className={cn("text-gray-600 dark:text-gray-100", danger && "text-red-600 dark:text-red-700")}
          />
        )}
        <P className={cn("text-gray-600 dark:text-gray-100 font-medium mt-0", danger && "text-red-600 dark:text-red-700")}>{text}</P>
      </div>
    );
  }
  
  export default SettingsItem;