import { cn, formatLastSeen } from "@/lib/utils";
import P from "../ui/typo/P";
import H3 from "../ui/typo/H3";
import { avatar1, avatar2, avatar3 } from "@/assets";
import { v4 as uuidv4 } from "uuid";
import { CreateDm } from "@/services/createDm";
import { useProfileStore } from "@/hooks/useProfile";
import AvatarUser from "./avatar-user";
import AvatarGroup from "./avatar-group";
import { JoinGroupChat } from "@/services/joinGroupChat";
interface UserProps extends UserBox {
  type: "user";
}

interface GroupProps extends GroupBox {
  type: "group";
}

interface CommonProps {
  toggleLoading: (value: boolean) => void;
  showRole?: boolean;
}

type Props = (UserProps | GroupProps) & CommonProps;

export default function UserGroupBox(props: Props) {
  const isGroup = props.type === "group";
  const { profile } = useProfileStore();
  const { handleCreate } = CreateDm({
    members: [{ userId: profile?.id ?? "" }, { userId: props.id }],
    onComplete: () => {
      props.toggleLoading(false);
    },
  });
  const { handleJoin } = JoinGroupChat({
    chatId: isGroup ? props.chatId : "",
    onComplete() {
      props.toggleLoading(false);
    },
  });
  async function handleClick() {
    props.toggleLoading(true);
    if (!isGroup) {
      handleCreate();
    } else {
      handleJoin();
    }
  }
  const obj = !isGroup ? formatLastSeen(props.lastSeen) : null;
  return (
    <div
      className={`
      w-full 
      relative 
      flex 
      items-center 
      space-x-3 
      py-3 
      px-1
      hover:bg-neutral-200
      dark:hover:bg-[#272A20]
      rounded-lg
      transition
      cursor-pointer
      `}
      onClick={handleClick}
    >
      <div className="relative">
        {isGroup ? (
          <>
            <AvatarGroup avatars={props.avatars} />
          </>
        ) : (
          <>
            <AvatarUser src={props.avatar} />
            {obj?.isOnline && (
              <div className="bg-brand-p1 rounded-full ring-2 ring-white h-3 block w-3  shadow-[0_0_20px_#4C8DC3] right-0 top-0 absolute z-30"></div>
            )}
          </>
        )}
      </div>
      <div>
        <H3 className="text-xl font-medium mb-1 text-gray-900 truncate dark:text-gray-100">
          <span>{isGroup ? props.name : props.username}</span>{" "}
          {!isGroup && props.showRole && props.role !== "MEMBER" && (
            <span
              className={cn(
                " !capitalize rounded-md border text-xs px-1  tracking-tight leading-snug",
                props.role === "OWNER" &&
                  "border-[#ac9619] font-medium text-[#ac9619]",
                props.role === "ADMIN" && "border-brand-p1 text-brand-p1"
              )}
            >
              {props.role}
            </span>
          )}
        </H3>
        <P
          className={cn(
            ` 
                  text-xs
                  text-[#17191c] dark:text-gray-500 fontlight
                  `,
            obj?.isOnline && "text-brand-p1 font-medium"
          )}
        >
          {isGroup ? props.description : obj?.lastSeen}
        </P>
      </div>
    </div>
  );
}
export const sampleUserBoxData: UserBox[] = [
  {
    avatar: avatar2,
    id: uuidv4(),
    lastSeen: new Date(),
    username: "user",
    role: "OWNER",
  },
  {
    avatar: avatar1,
    id: uuidv4(),
    lastSeen: new Date(new Date().getTime() - 30 * 60 * 1000),
    username: "user1",
    role: "ADMIN",
  },
  {
    avatar: avatar2,
    id: uuidv4(),
    lastSeen: new Date(new Date().getTime() - 40 * 60 * 1000),
    username: "user2",
    role: "MEMBER",
  },
  {
    avatar: avatar1,
    id: uuidv4(),
    lastSeen: new Date(new Date().getTime() - 100 * 60 * 1000),
    username: "user3",
    role: "MEMBER",
  },
  {
    avatar: avatar3,
    id: uuidv4(),
    lastSeen: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    username: "user4",
    role: "MEMBER",
  },
];
