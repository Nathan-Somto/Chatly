import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import {v4 as uuidv4} from "uuid";
type Props = {
  members: {
    user: {
      username: string;
      avatar: string;
    };
  }[];
};
function AvatarGroup({ members }: Props) {
  const avatarArr: Props["members"] =
    members.length < 3
      ? [
          ...members,
          ...new Array(3 - members.length).fill({
            user: {
              username: "unknown",
              avatar: "",
            },
          }),
        ]
      : members.slice(3);
  const positionMap = {
    0: " z-[1] -top-1 left-2",
    1: "z-[2] -left-1 bottom-0",
    2: " z-[0] -right-1 bottom-0",
  };
  return (
    <figure className="flex items-center relative h-12 w-12">
      {avatarArr.map((item, index) => {
        if (item.user.username === "unknown") {
          return (
            <User
            key={uuidv4()}
              className={cn(
                "h-8 w-8 absolute rounded-[50%] border-2 text-gray-400 bg-[#eee] p-1 border-slate-500 dark:border-slate-700",
                positionMap[index as keyof typeof positionMap]
              )}
            />
          );
        }
       return ( <img
        key={uuidv4()}
          src={item.user.avatar}
          alt={`${item.user.username} avatar`}
          className={cn(
            "h-8 w-8 absolute rounded-[50%] border-2 border-slate-500 p-0 dark:border-slate-700",
            positionMap[index as keyof typeof positionMap]
          )}
        />)
      })}
    </figure>
  );
}

export default AvatarGroup;
