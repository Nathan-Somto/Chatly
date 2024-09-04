import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  ChevronLeft,
  ImageOff,
  UploadIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import defaultWallpapers, {
  solidDarkColors,
  solidLightColors,
} from "@/constants";
import Header from "@/components/common/header";
import { useProfileStore } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/wrappers/theme-provider";
import { v4 } from "uuid";
import Message from "@/components/chat/message";
import { useMutate } from "@/hooks/query/useMutate";
import { useQueryClient } from "@tanstack/react-query";
import { GetResponse } from "@/hooks/query";
import { GetUserResponse, WallpaperType } from "@/api-types";
import { uploadFile } from "@/lib/utils";

type SelectedWallpaper =
  | {
      url: string;
      wallpaperType: Exclude<WallpaperType, "COLOR">;
    }
  | {
      color: string;
      wallpaperType: Exclude<WallpaperType, "DEFAULT" | "UPLOADED">;
    }
  | null;
const previewMessages = (profileId: string, avatarUrl: string): Message[] => [
  {
    Sender: {
      username: "MyUsername",
      avatar: "https://example.com/my-avatar.png",
    },
    id: "msg1",
    body: "Hey, how's it going?",
    senderId: profileId,
    isEditted: false,
    readByIds: [],
    resourceUrl: null,
    type: "TEXT",
    createdAt: new Date(),
    chatId: "chat1",
    parentMessage: null,
    isReply: false,
  },
  {
    Sender: {
      username: "OtherUser",
      avatar: avatarUrl,
    },
    id: "msg2",
    body: "I'm good, thanks! How about you?",
    senderId: v4(),
    isEditted: false,
    readByIds: [],
    resourceUrl: null,
    type: "TEXT",
    createdAt: new Date(),
    chatId: "chat1",
    parentMessage: null,
    isReply: false,
  },
];

export type DefaultWallpapers = keyof typeof defaultWallpapers;
function WallpaperSelector() {
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { profile, updateProfile: updateProfileStore } = useProfileStore();
  const [selectedWallpaper, setSelectedWallpaper] =
    useState<SelectedWallpaper>(null);
  const [uploadedWallpaper, setUploadedWallpaper] = useState<string | null>(
    null
  );
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [defaultWallpaperKey, setDefaultWallpaperKey] =
    useState<DefaultWallpapers | null>(null);

  const solidColors = useMemo(
    () => (theme === "dark" ? solidDarkColors : solidLightColors),
    [theme]
  );

  const handleDefaultSelect = (key: DefaultWallpapers, wallpaper: string) => {
    setDefaultWallpaperKey(key);
    setSelectedWallpaper({ url: wallpaper, wallpaperType: "DEFAULT" });
  };

  useEffect(() => {
    if (profile) {
      const profileWallpaper: SelectedWallpaper =
        profile.wallpaperType && profile.wallpaperUrl
          ? profile.wallpaperType === "COLOR"
            ? { color: profile.wallpaperUrl, wallpaperType: "COLOR" }
            : {
                url: profile.wallpaperUrl,
                wallpaperType: profile.wallpaperType,
              }
          : null;

      setSelectedWallpaper(profileWallpaper);
      if (profile.wallpaperType === "UPLOADED") {
        setUploadedWallpaper(profile?.wallpaperUrl ?? null);
      }
    }
  }, [profile]);

  const updatedWallpaper = useMemo(
    () => ({
      wallpaperType: selectedWallpaper?.wallpaperType,
      wallpaperUrl:
        selectedWallpaper?.wallpaperType === "COLOR"
          ? selectedWallpaper.color
          : selectedWallpaper?.wallpaperType === "DEFAULT"
          ? defaultWallpaperKey ?? undefined
          : selectedWallpaper?.url,
    }),
    //@ts-ignore
    [selectedWallpaper?.color, selectedWallpaper?.url, selectedWallpaper?.wallpaperType, defaultWallpaperKey]
  );
  const { mutate: updateProfile, isPending: isUpdating } = useMutate({
    method: "patch",
    route: "/users",
    onSuccess() {
    console.log(updatedWallpaper);
    queryClient.setQueryData(
        ["profile"],
        (oldData: GetResponse<GetUserResponse>) => {
            console.log(oldData);
            return {
                data: {
                    user: {
                        ...profile,
                        ...updatedWallpaper,
                    },
                },
            };
        }
    );
    updateProfileStore(updatedWallpaper);
      navigate(`/${profile?.id}/chats`);
    },
  });
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedWallpaper(url);
      setFileToUpload(file);
      setSelectedWallpaper({ url, wallpaperType: "UPLOADED" });
    }
  };

  const handleSave = async () => {
    try {
      let wallpaperUrl = uploadedWallpaper;
      if (selectedWallpaper?.wallpaperType === "UPLOADED" && fileToUpload) {
        // Upload the file  if the wallpaperType is "UPLOADED"
        wallpaperUrl = await uploadFile(fileToUpload);
        if (wallpaperUrl) {
          setSelectedWallpaper({
            url: wallpaperUrl,
            wallpaperType: "UPLOADED",
          });
        } else {
          return;
        }
      }
      updateProfile({ ...updatedWallpaper, wallpaperUrl });
    } catch (err) {}
  };

  return (
    <>
      <Header>
        <div className="flex gap-x-2 items-center">
          <Button
            variant="link"
            size="icon"
            onClick={() => navigate(`/${profile?.id}/chats`)}
          >
            <ChevronLeft />
          </Button>
          <h1>Change Wallpaper</h1>
        </div>
      </Header>
      <div className="p-4 w-[80%] mx-auto">
        <Tabs defaultValue={profile?.wallpaperType?.toLowerCase() ?? "default"}>
          <TabsList>
            <TabsTrigger value="default">Default Wallpapers</TabsTrigger>
            <TabsTrigger value="colors">Solid Colors</TabsTrigger>
            <TabsTrigger value="uploaded">Uploaded Wallpaper</TabsTrigger>
          </TabsList>

          <TabsContent value="colors">
            <div className="grid grid-cols-3 gap-4">
              {solidColors.map((color) => (
                <div
                  key={color}
                  className="h-[200px] w-full rounded-lg cursor-pointer relative"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setSelectedWallpaper({ color, wallpaperType: "COLOR" })
                  }
                >
                  {selectedWallpaper?.wallpaperType === "COLOR" &&
                    selectedWallpaper.color === color && (
                      <CheckCircleIcon className="w-8 h-8 text-green-500 absolute right-1 top-1" />
                    )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="default">
            <div className="grid grid-cols-3 gap-4">
              {(
                Object.entries(defaultWallpapers) as [
                  DefaultWallpapers,
                  string
                ][]
              ).map(([key, value]) => {
                if (key === "light2" && theme === "dark") return null;
                return (
                  <div
                    key={key}
                    className="h-[200px] w-full bg-cover relative bg-center rounded-lg cursor-pointer"
                    style={{ backgroundImage: `url(${value})` }}
                    onClick={() => handleDefaultSelect(key, value)}
                  >
                    {selectedWallpaper?.wallpaperType === "DEFAULT" &&
                      selectedWallpaper?.url === value && (
                        <CheckCircleIcon className="w-8 h-8 text-green-500 absolute right-1 top-1" />
                      )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="uploaded">
            <div className="grid grid-cols-3 gap-4">
              {uploadedWallpaper && (
                <div
                  className="h-[200px] w-full bg-cover bg-center relative rounded-lg cursor-pointer"
                  style={{ backgroundImage: `url(${uploadedWallpaper})` }}
                  onClick={() =>
                    setSelectedWallpaper({
                      url: uploadedWallpaper,
                      wallpaperType: "UPLOADED",
                    })
                  }
                >
                  {selectedWallpaper?.wallpaperType === "UPLOADED" &&
                    selectedWallpaper?.url === uploadedWallpaper && (
                      <CheckCircleIcon className="w-8 h-8 text-green-500 absolute right-1 top-1" />
                    )}
                </div>
              )}
              {uploadedWallpaper === null && (
                <div className="h-[200px] w-full bg-cover flex justify-center items-center bg-center rounded-lg  border-2 cursor-pointer">
                  <ImageOff size={80} className="text-gray-600" />
                </div>
              )}
              <label className="flex flex-col items-center justify-center h-20 w-20 bg-gray-200 rounded-lg cursor-pointer">
                <UploadIcon className="w-8 h-8 text-gray-600" />
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="mt-6" disabled={selectedWallpaper === null}>
              Preview Wallpaper
            </Button>
          </DialogTrigger>
          <DialogContent disableClose={isUpdating}>
            <div
              className="h-96 w-full bg-cover bg-center rounded-lg"
              style={{
                backgroundImage:
                  selectedWallpaper?.wallpaperType === "DEFAULT" ||
                  selectedWallpaper?.wallpaperType === "UPLOADED"
                    ? `url(${selectedWallpaper.url})`
                    : "none",
                backgroundColor:
                  (selectedWallpaper?.wallpaperType === "COLOR" &&
                    selectedWallpaper?.color) ||
                  "transparent",
              }}
            >
              <div className="bg-white/60 p-4 rounded-lg mt-4 mx-2">
                <p className="text-gray-800">
                  This is a preview of the selected wallpaper with some message
                  blocks.
                </p>
              </div>
              <div className="w-full px-3">
                {previewMessages(profile?.id ?? "", profile?.avatar ?? "").map(
                  (item) => (
                    <Message
                      key={item.id}
                      openModal={function (_src: string): void {
                        throw new Error("Function not implemented.");
                      }}
                      index={0}
                      preview
                      {...item}
                    />
                  )
                )}
              </div>
            </div>
            <Button
              disabled={isUpdating}
              variant="outline"
              onClick={handleSave}
            >
              Set Wallpaper
            </Button>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default WallpaperSelector;
