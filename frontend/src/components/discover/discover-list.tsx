import { useState } from "react";
import ListContainer from "../common/list-container";
import Loader from "../ui/loader";
import UserBox, { sampleUserBoxData } from "../common/user-box";

export default function DiscoverList() {
  const [isLoading, setIsLoading] = useState(false);
  function toggleLoading(value: boolean) {
    setIsLoading(value);
  }
  return (
    <>
      <ListContainer>
        {sampleUserBoxData.map((item) => (
          <UserBox
            avatar={item.avatar}
            id={item.id}
            lastSeen={item.lastSeen}
            username={item.username}
            toggleLoading={toggleLoading}
          />
        ))}
      </ListContainer>
      {isLoading && <Loader />}
    </>
  );
}
