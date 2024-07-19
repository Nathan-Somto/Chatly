import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useMessageOptions } from "@/hooks/useMessageOptions";
import { useMessages } from "@/hooks/useMessages";
//import { useNavigate } from "react-router-dom";

export default function DeleteMessageModal() {
  // const navigate = useNavigate();
  const { setMessages, messages } = useMessages();
  const {
    toggleDeleteModal,
    messageOptions: {
      deleteModal: { id, open },
    },
  } = useMessageOptions();
  async function handleDelete() {
    // send to endpoint
    console.log("delete modal: ",id)
    const messageCopy = messages.filter((message) => message.id !== id);
    setMessages(messageCopy);
    // close modal
    toggleDeleteModal({
      id: "",
      open: false,
    });
  }
  return (
    <Dialog
      open={open}
      onOpenChange={(openValue) =>
        toggleDeleteModal({
          open: openValue,
          id: open ? id : "",
        })
      }
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Message</DialogTitle>
          <DialogDescription>
            This action will delete the message for all users
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"secondary"}>Cancel</Button>
          <Button variant={"destructive"} onClick={handleDelete}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
