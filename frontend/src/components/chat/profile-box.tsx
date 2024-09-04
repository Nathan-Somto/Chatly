// simple dropdown menu shadcn ui component that accepts a usrrname, avatar, and id of a user, accepts the image of the user as a child for the dropdown menu trigger
// has a button that when clicked calls the the createDm service and redirects the chat page.
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "../common/avatar";
import { Button } from "../ui/button";
import { CreateDm } from "@/services/createDm";
import { SendHorizonalIcon } from "lucide-react";
import { useProfileStore } from "@/hooks/useProfile";
type Props = {
  username: string;
  avatarUrl: string;
  id: string;
  children: React.ReactNode;
};
export default function ProfileBox({ children, avatarUrl, username, id }: Props) {
  const { profile } = useProfileStore();
  const { handleCreate, isPending } = CreateDm({
    members: [{ userId: profile?.id ?? "" }, { userId: id }],
    onComplete: () => {},
  });
  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <>{children}</>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-3 px-2 min-w-[100px]">
          <div className="flex flex-col gap-y-1">
            <Avatar
              type="User"
              src={avatarUrl}
              alt={username}
              size={60}
              className="mx-0"
            />
            <p className="text-[16.5px] ml-2 opacity-80 font-light">
              {username}
            </p>
          </div>
          <div className="mt-2">
            <Button
              disabled={isPending}
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (profile?.id) {
                  handleCreate();
                }
              }}
              className="w-full gap-x-1.5"
            >
              {isPending ? (
                "Loading..."
              ) : (
                <>
                  <span>Send Message</span>
                  <SendHorizonalIcon size={18} />
                </>
              )}
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
