import { useState } from "react";
import { SearchDataType } from ".";
import UserGroupBox from "../common/user-group-box";
import P from "../ui/typo/P";
import Loader from "../ui/loader";
type Props = {
  data: SearchDataType;
  isSearching: boolean;
  isError: boolean;
  keyword: string;
  resultLength: number;
};
export default function SearchBody({
  keyword,
  data,
  isSearching,
  isError,
  resultLength,
}: Props) {
    const [loading, setLoading] = useState<boolean>(false)
    function toggleLoading(value: boolean){
        setLoading(value)
    }     
      function isGroupBox(item: UserBox | GroupBox): item is GroupBox {
        return (item as GroupBox).isGroup !== undefined;
      }
  return (
    <>
    <div>
      <>
        <div className="border-b mb-2 pb-4 px-3 mt-3">
          <P className="font-medium ">
            {" "}
            {resultLength} result{resultLength > 1 ? "s" : ""}{" "}
          </P>
        </div>
        {isSearching ? (
          <div className="h-full items-center flex justify-center">
            <Loader withBackground={false} size="sm"/>
          </div>
        ) : data.length > 0 ? (
          data.map((item) => {
            if (isGroupBox(item)) {
              return (
                <UserGroupBox
                  type="group"
                  avatars={item.avatars}
                  chatId={item.chatId}
                  description={item.description}
                  id={item.id}
                  isGroup
                  name={item.name}
                  key={item.id}
                  toggleLoading={toggleLoading}
                />
              );
            }
            return (
              <UserGroupBox
                type="user"
                avatar={item.avatar}
                id={item.id}
                lastSeen={item.lastSeen}
                username={item.username}
                key={item.id}
                toggleLoading={toggleLoading}
              />
            );
          })
        ) : null}
        {!isSearching ||
          isError ||
          (resultLength === 0 && (
            <p className="mt-8"> no results for {keyword}</p>
          ))}
      </>
    </div>
    {loading && (<Loader withBackground size={'lg'}/>)}
    </>
  );
}
