import { useState } from "react";
import ListContainer from "../common/list-container";
import Loader from "../ui/loader";
import UserGroupBox from "../common/user-group-box";
import { ErrorMessage } from "../common/error-message";
import { useGetQuery } from "@/hooks/query/useGetQuery";
import { GetUsersResponse } from "@/api-types";

export default function DiscoverList() {
  const [isLoading, setIsLoading] = useState(false);
  function toggleLoading(value: boolean) {
    setIsLoading(value);
  }
  const {
    data: response,
    isPending,
    isError,
    refetch,
  } = useGetQuery<GetUsersResponse>({
    enabled: true,
    queryKey: ["discover"],
    route: "users",
    displayToast: true,
  });
  if (isError) {
    <ErrorMessage refetch={refetch} title="Failed to Find Users" />;
  }
  return (
    <>
      <ListContainer>
        <>
          {response?.data?.users?.map((item) => (
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
