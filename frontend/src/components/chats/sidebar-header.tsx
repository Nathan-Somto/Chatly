import { ChevronLeft, GlobeIcon, Loader, LucideUsers2, SearchIcon, UserPlus2 } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import GroupIcon from "../drawers/settingsDrawer/GroupIcon";
import { useNavigate } from "react-router-dom";
import GroupChatModal from "../modals/groupchat-modal";
import { DmModal } from "../modals/dm-modal";
import { useProfileStore } from "@/hooks/useProfileStore";
import AvatarUser from "../common/avatar-user";
type Props = {
  openDrawer: (value: boolean) => void;
  handleSearch: (keywords: string) => Promise<void>;
  showBack: boolean;
  goBackToChats: React.Dispatch<React.SetStateAction<string>>;
};
function SidebarHeader({ openDrawer, handleSearch, showBack, goBackToChats }: Props) {
  const [keywords, setKeywords] = useState<string>("");
  const {profile} = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);
  function toggleLoading(value: boolean) {
    setIsLoading(value);
  }
  const [openGroupModal, setOpenGroupModal] = useState(false);
  const [openDmModal, setOpenDmModal] = useState(false);
  const navigate = useNavigate()
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSearch(keywords);

  }
  function handleClick(){
    goBackToChats('');
    setKeywords('');
  }
  function setModal(value: boolean, isGroup: boolean){
    if(isGroup){
      setOpenGroupModal(value)
      return;
    }
    setOpenDmModal(value)
  }
  return (
    <>
    <header className="flex px-3  items-center justify-between h-16 lg:gap-2">
      {showBack ? (
        <Button onClick={handleClick} variant={'ghost'} className="p-0  text-gray-500 hover:bg-transparent hover:text-gray-500">
          <ChevronLeft size={26}/>
          <span className="sr-only">Back</span>
        </Button>
      ): (
      <Button
        onClick={() => openDrawer(true)}
        variant={"ghost"}
        className="p-0  text-gray-500 border-none  h-fit w-fit flex-shrink-0  hover:bg-transparent hover:opacity-50 border-2 border-slate-500  dark:border-slate-700"
      >
       <AvatarUser src={profile?.avatar ?? ''} size={40}/>
      </Button>
      )}
      <form onSubmit={handleSubmit} className=" w-[calc(90%-96px)] lg:w-[70%] flex-shrink-0">
        <label className="w-full  relative  ">
          <Button
            variant={"ghost"}
            className="absolute left-0 top-0 ml-2 bottom-0 my-auto h-fit w-fit mr-4 p-0 text-gray-500 hover:bg-transparent hover:text-gray-500"
          >
            <SearchIcon size={16} />
            <p className="sr-only">Search</p>
          </Button>
          <input
            type="text"
            name="keywords"
            placeholder="Search for users or groups"
            onChange={(e) => setKeywords(e.target.value)}
            value={keywords}
            className="w-full py-2 pl-9 pr-4 h-10 dark:bg-gray-50 placeholder-gray-400  text-gray-600 border border-gray-300 focus:border-transparent rounded-3xl outline-none focus:ring-brand-p2 focus:ring-2"
          />
        </label>
      </form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button variant={'ghost'} size={'icon'} className="rounded-full bg-neutral-200 hover:opacity-50 dark:bg-neutral-700 border-2">
      <LucideUsers2/>
     </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="py-3 space-y-2">
          <DropdownMenuItem onClick={() => setModal(true, false)} className="gap-2 py-2 px-4 justify-start hover:opacity-80 cursor-pointer  dark:hover:bg-[#272A20]">
            <UserPlus2 className='!opacity-50 h-5 w-5'/>
            New DM
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setModal(true, true)} className="gap-2 py-2 px-4 justify-start hover:opacity-80 cursor-pointer dark:hover:bg-[#272A20]">
            <GroupIcon className='!opacity-50 h-5 w-5'/>
            New Group Chat
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/discover')} className="gap-2 py-2 px-4 justify-start hover:opacity-80 cursor-pointer dark:hover:bg-[#272A20]">
            <GlobeIcon className='!opacity-50 h-5 w-5'/>
            Discover People
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
    <GroupChatModal  open={openGroupModal} setModal={setModal}/>
    <DmModal open={openDmModal} setModal={setModal} toggleLoading={toggleLoading}/>
    {isLoading && <Loader/>}
    </>
  );
}

export default SidebarHeader;
