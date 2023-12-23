import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
//import { useNavigate } from "react-router-dom";
type Props = {
  open: boolean;
  setModals: React.Dispatch<React.SetStateAction<{
    groupChat: boolean;
    deleteAccount: boolean;
}>>
}
export default  function DeleteModal({
open,
setModals
}: Props) {
 // const navigate = useNavigate();
  async function handleDelete(){
    // send to endpoint
    // close modal
    setModals(prevState => ({
      ...prevState,
      deleteAccount: false
    }))
  
  }
  return (
    <Dialog open={open} onOpenChange={(open) =>  setModals(prevState => ({
      ...prevState,
      deleteAccount: open
    })) }>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your messages from our database.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'secondary'}>Cancel</Button>
          <Button variant={'destructive'} onClick={handleDelete}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
