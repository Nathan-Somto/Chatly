import { SheetContent, Sheet, SheetDescription, } from "@/components/ui/sheet"

function ProfileDrawer({isOpen, openDrawer}: DrawerProps) {
  return (
     <Sheet  open={isOpen} onOpenChange={(open) => openDrawer(open)}>
        <SheetContent side={'right'}>
         <SheetDescription>Group Info | Other User's Info</SheetDescription>
        </SheetContent>
     </Sheet>
  )
}

export default ProfileDrawer