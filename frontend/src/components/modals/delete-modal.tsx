import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
type Props = {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  deleteFn: () => void | Promise<void>;
  message?: string;
  title?: string;
  isPending: boolean;
};
export default function DeleteModal({
  open,
  onOpenChange,
  deleteFn,
  title = `Are you absolutely sure?`,
  message = `This action cannot be undone. This will permanently delete this item.`,
  isPending,
}: Props) {
  async function handleDelete() {
    // send to endpoint
    await deleteFn();
    // close modal
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            {isPending ? "Deleting..." : "Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
