import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import { Power } from "lucide-react";
import { Button } from "./ui/button";

type Props = {
  handleLogout: () => void;
};

const AlertLogoutDialog = (props: Props) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <DropdownMenuItem className="">
          <Power className="mr-2" strokeWidth={0.75} /> Logout
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Logout Confirmation</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will be logged out of your account and
            will need to sign in again to access your account.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={props.handleLogout}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AlertLogoutDialog;
