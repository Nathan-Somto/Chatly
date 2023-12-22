import { ChevronLeft, MenuIcon, SearchIcon, Users2 } from "lucide-react";
import { Button } from "../ui/button";
import React, { useState } from "react";
import { avatar3 } from "@/assets";
type Props = {
  openDrawer: (value: boolean) => void;
  handleSearch: (keywords: string) => Promise<void>;
  showBack: boolean;
  goBackToChats: React.Dispatch<React.SetStateAction<string>>;
};
function SidebarHeader({ openDrawer, handleSearch, showBack, goBackToChats }: Props) {
  const [keywords, setKeywords] = useState<string>("");
  const user = {
    avatar:avatar3
  }
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    handleSearch(keywords);

  }
  function handleClick(){
    goBackToChats('');
    setKeywords('');
  }
  return (
    <header className="flex items-center justify-around h-16 lg:gap-2">
      {showBack ? (
        <Button onClick={handleClick} variant={'ghost'} className="p-0 text-gray-500 hover:bg-transparent hover:text-gray-500">
          <ChevronLeft size={26}/>
          <span className="sr-only">Back</span>
        </Button>
      ): (
      <Button
        onClick={() => openDrawer(true)}
        variant={"ghost"}
        className="p-0  text-gray-500 rounded-[50%] h-10 w-10 flex-shrink-0 overflow-hidden hover:bg-transparent hover:text-gray-500 border-2 border-slate-500  dark:border-slate-700"
      >
       <img src={user.avatar} alt="user's avatar" className="h-full w-full object-cover"/>
      </Button>
      )}
      <form onSubmit={handleSubmit} className="w-[80%] flex-shrink-0">
        <label className="w-full  relative  ">
          <Button
            variant={"ghost"}
            className="absolute left-0 top-0 ml-2 bottom-0 my-auto h-fit w-fit mr-4 p-0 text-gray-500 hover:bg-transparent hover:text-gray-500"
          >
            <SearchIcon size={18} />
            <p className="sr-only">Search</p>
          </Button>
          <input
            type="text"
            name="keywords"
            placeholder="Search for users"
            onChange={(e) => setKeywords(e.target.value)}
            value={keywords}
            className="w-full py-2 pl-9 pr-4 h-10  placeholder-slate-400  text-gray-600 border border-gray-300 focus:border-transparent rounded-lg outline-none focus:ring-brand-p2 focus:ring-2"
          />
        </label>
      </form>
     
    </header>
  );
}

export default SidebarHeader;
