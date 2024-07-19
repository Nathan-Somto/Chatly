import { EmptyState } from "@/components/common/empty-state";
import DiscoverList from "@/components/discover/discover-list";
import { Button } from "@/components/ui/button";
import H3 from "@/components/ui/typo/H3";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Discover() {
  const navigate = useNavigate();
  return (
    <div>
      <aside className="lg:w-[350px] py-6 lg:fixed lg:left-0 lg:top-0 w-full bg-gray-100 dark:bg-[#17191C] border-r min-h-screen">
        <header className="flex px-3  items-center h-10 gap-x-2">
          <Button
            onClick={() => navigate(-1)}
            variant={"ghost"}
            className="p-0  text-gray-500 hover:bg-transparent hover:text-gray-500"
          >
            <ChevronLeft size={24} />
            <span className="sr-only">Back</span>
          </Button>
          <H3 className="text-brand-p1 font-medium text-lg">Discover People</H3>
        </header>
        <DiscoverList />
      </aside>
      <main className="lg:block hidden w-full lg:ml-[350px] bg-gray-50 min-h-screen dark:bg-background lg:w-[calc(100%-350px)]">
        <EmptyState />
      </main>
    </div>
  );
}
