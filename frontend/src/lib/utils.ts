import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AxiosError } from "axios";
import { mainApi } from "./axios";
import toast from "react-hot-toast";
import { Profile } from "@/hooks/useProfile";
import { ModifiedMessage } from "@/hooks/useMessages";
import { v4 } from "uuid";
import { WallpaperType } from "@/api-types";
import defaultWallpapers from "@/constants";
import { DefaultWallpapers } from "@/pages/Wallpaper";
export function article(name: string) {
  // based on first character of name returns a or an
  // use regex and in case i have an empty string return the empty string
  if (name.length === 0) return "";
  const firstLetter = name[0].toLowerCase();
  return /aeiou/.test(firstLetter) ? "an" : "a";
}
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLastSeen(lastSeen: Date | string | number): {
  lastSeen: string;
  isOnline: boolean;
} {
  const obj = {
    lastSeen: "",
    isOnline: false,
  };
  let seconds = 300 * 1000; // 5 minutes
  const now = new Date().getTime();
  const lastSeenDate =
    typeof lastSeen === "string" || typeof lastSeen === "number"
      ? new Date(lastSeen)
      : lastSeen;
  if (!(lastSeenDate instanceof Date)) return obj;
  const lastSeenTime = lastSeenDate.getTime();
  const diff = now - lastSeenTime;
  if (diff <= seconds) {
    obj.lastSeen = "Online";
    obj.isOnline = true;
    return obj;
  }
  seconds = 60 * 1000; // 1 minute
  if (Math.ceil(diff / seconds) <= 59) {
    obj.lastSeen = `last seen ${Math.ceil(diff / seconds)} minutes ago`;
    return obj;
  }
  seconds = seconds * 60; // 1 hour
  if (Math.ceil(diff / seconds) <= 23) {
    obj.lastSeen = `last seen ${Math.ceil(diff / seconds)} hours ago`;
    return obj;
  }
  obj.lastSeen = `last seen at ${lastSeenDate.toDateString()}`;
  return obj;
}
export async function uploadFile(file: File): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);
  try {
    const response = await mainApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.url;
  } catch (error) {
    toast.error("Failed to upload image!");
    return null;
  }
}
export function displayError(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  let description = defaultMessage;

  if (error instanceof AxiosError && error.response?.data.message) {
    description = error.response.data.message;
  } else if (error instanceof Error) {
    description = error.message;
  } else if (typeof error === "string") {
    description = error;
  }

  return description;
}
export function generateUsername(name: string) {
  let digits = "";
  for (let i = 0; i < 3; i++) {
    digits += Math.floor(Math.random() * 10).toString();
  }
  return name + digits;
}
export function createOptimisticMessage(
  profile: NonNullable<Profile>,
  body: string,
  chatId: string,
  resourceUrl: string | null,
  resource_type: "image" | "video",
  isReply: boolean,
  replyTo: ReplyTo | null
): ModifiedMessage {
  const resource_type_map: { [key: string]: MessageType } = {
    image: "IMAGE",
    video: "VIDEO",
  };

  let optimisticMessage: ModifiedMessage = {
    Sender: {
      username: profile.username,
      avatar: profile.avatar,
    },
    body,
    chatId,
    id: v4(),
    createdAt: new Date(),
    isEditted: false,
    readByIds: [],
    resourceUrl,
    senderId: profile.id,
    type: resourceUrl !== null ? resource_type_map[resource_type] : "TEXT",
    sending: true,
    isReply,
    parentMessage: null,
  };

  if (isReply && replyTo) {
    optimisticMessage.parentMessage = {
      body: replyTo.text,
      avatar: replyTo.avatar,
      username: replyTo.username,
    };
  }

  return optimisticMessage;
}
export function renderChatWallpaper(
  wallpaperType: WallpaperType,
  wallpaperUrl: string
) {
  let url: string =
    wallpaperType === "DEFAULT" && wallpaperUrl in defaultWallpapers
      ? defaultWallpapers[wallpaperUrl as DefaultWallpapers]
      : wallpaperUrl;
  return {
    backgroundImage:
      wallpaperType === "DEFAULT" || wallpaperType === "UPLOADED"
        ? `url(${url})`
        : "none",
    backgroundColor: (wallpaperType === "COLOR" && url) || "transparent",
  };
}
