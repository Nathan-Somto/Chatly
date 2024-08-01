import { CreateDmPayload } from "@/api-types";
import { useMutate } from "@/hooks/query/useMutate";
import { useProfileStore } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
type Props = {
    members: CreateDmPayload["members"];
    onComplete?: () => void;
}
// uses the useMutate hook to create a dm, there is no need to emit
export function CreateDm({members, onComplete}: Props){
    const {profile} = useProfileStore();
    const navigate = useNavigate()
    const  {mutate, isPending} = useMutate({
        defaultMessage: "Failed to create dm!",
        method: "post",
        route: "/chats/create-dm",
        onSuccess(response) {
            navigate(`/${profile?.id}/chats/${response.data?.privateChat?.id}`);
        },
        onSettled() {
            onComplete && onComplete();
        }
    });
   async  function handleCreate(){
        mutate(members)
    }
    return {
        handleCreate,
        isPending
    }
}