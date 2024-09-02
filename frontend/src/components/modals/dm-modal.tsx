import { MoreHorizontalIcon, RefreshCcw, SearchIcon, UserPlus2Icon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import H2 from "../ui/typo/H2";
import { Button } from "../ui/button";
import { useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import UserGroupBox from "../common/user-group-box";
import P from "../ui/typo/P";
import Search from "@/services/search";
type Props = {
  open: boolean;
  setModal: (value: boolean, isGroup: boolean) => void;
  toggleLoading: (value: boolean) => void;
};

export function DmModal({ open, setModal, toggleLoading }: Props) {
  const [keywords, setKeywords] = useState("");
  const debouncedValue = useDebounce(keywords, 500);
  console.log(keywords.length > 0)
  const {
    searchData,
    isError,
    isLoading:loading
  } = Search({
    keyword: debouncedValue,
    usersOnly: true,
    enabled: keywords.length > 0 && debouncedValue.length > 0,
  });
  console.log("loading:", loading)
  const users = useMemo(() => {
    return searchData?.data ? searchData.data.users : null;
  }, [searchData?.data]);
  return (
    <Dialog open={open} onOpenChange={(open) => setModal(open, false)}>
      <DialogContent className="h-[450px] block gap-0 overflow-auto  pb-5">
        <DialogHeader className="mt-2 mb-6 flex items-center gap-x-2 flex-row">
          {" "}
          <UserPlus2Icon size={28} />
          <H2 className="text-2xl">New Direct Message</H2>
        </DialogHeader>
        <form className=" w-full h-10 flex-shrink-0 mb-3">
          <label className="w-full  relative  ">
            <Button
              variant={"ghost"}
              className="absolute focus:outline-none left-0 top-0 ml-2 bottom-0 my-auto h-fit w-fit mr-4 p-0 text-gray-500 hover:bg-transparent hover:text-gray-500"
            >
              <SearchIcon size={16} />
              <p className="sr-only">Search</p>
            </Button>
            <input
              type="text"
              name="keywords"
              placeholder="Search by Username"
              onChange={(e) => setKeywords(e.target.value)}
              value={keywords}
              className="w-full py-2 pl-9 pr-4 h-10 dark:bg-gray-50 placeholder-gray-400  text-gray-600 border border-gray-300 focus:border-transparent rounded-3xl outline-none focus:ring-brand-p2 focus:ring-2"
            />
          </label>
        </form>
        <div className={"px-5 py-0 min-h-[200px] flex items-center flex-col"}>
          {loading ? (
            <P className="opacity-80 text-neutral-500 leading-snug tracking-wide flex items-center gap-x-1">
              Finding users{" "}
              <span>
                <MoreHorizontalIcon className="animate-bounce" />
              </span>
            </P>
          ) : users === null ? (
            isError ? (
              <div className="flex flex-col justify-start mt-2 w-full flex-shrink-0">
                <P className="mb-2 text-lg font-medium">Something went wrong!</P>
                <Button className="max-w-fit gap-x-1.5">Retry <RefreshCcw size={16}/></Button>
              </div>
            ) : (
              <P className="font-medium opacity-80 mx-auto w-full ">
                Type the names of your friends or family and start a chat now!
              </P>
            )
          ) : users.length === 0 ? (
            <P>
              No Users fits this search term{" "}
              <span className="font-semibold text-brand-p2">{keywords}</span>
            </P>
          ) : (
            users.map((user) => (
              <UserGroupBox
                type="user"
                avatar={user.avatar}
                id={user.id}
                key={user.id}
                lastSeen={user.lastSeen}
                username={user.username}
                toggleLoading={toggleLoading}
              />
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
