import { CopyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from "react-hot-toast";

type Props = {
  setVisiblity: (value: boolean) => void;
  open: boolean;
  inviteLink: string;
}
export function InviteModal({open, inviteLink, setVisiblity}: Props) {
  function handleCopy(){
    navigator.clipboard.writeText(inviteLink)
    toast.success('successfully copied link');
  }
  return (
    <Dialog open={open} onOpenChange={open => setVisiblity(open)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to join this group.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <label htmlFor="link" className="sr-only">
              Link
            </label>
            <input
              id="link"
              defaultValue={"https://"+inviteLink}
              readOnly
              className="dark:text-gray-950 underline  bg-gray-100 dark:bg-gray-300 rounded-lg p-2 w-full"
            />
          </div>
          <Button type="submit" size="sm" onClick={handleCopy} className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
