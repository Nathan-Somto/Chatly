import { useState } from "react";
import ListContainer from "../common/list-container";
import Loader from "../ui/loader";
import UserGroupBox from "../common/user-group-box";
import Search from "@/services/search";
import { ErrorMessage } from "../common/error-message";

export default function DiscoverList() {
  const [isLoading, setIsLoading] = useState(false);
  function toggleLoading(value: boolean) {
    setIsLoading(value);
  }
  const { searchData, isPending, isError, refetch } = Search({
    keyword: "",
    usersOnly: true,
  });

  if (isError) {
    <ErrorMessage refetch={refetch} title="Failed to Find People" />;
  }
  return (
    <>
      <ListContainer>
        <>
          {searchData?.data?.users?.map((item) => (
            <UserGroupBox
              type="user"
              avatar={item.avatar}
              id={item.id}
              lastSeen={item.lastSeen}
              username={item.username}
              toggleLoading={toggleLoading}
            />
          ))}
          {isPending && (
            <div className="flex items-center h-full justify-center">
              <Loader withBackground={false} />
            </div>
          )}
        </>
      </ListContainer>
      {isLoading && <Loader />}
    </>
  );
}
