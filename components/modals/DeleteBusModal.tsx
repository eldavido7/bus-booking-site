import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
// import { Bus } from "../../context/BookingContext";
import { mockTrips } from "../../lib/mockData";
import { toast } from "sonner";

interface DeleteBusModalProps {
  bus: { id: string; operator: string };
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function DeleteBusModal({
  bus,
  isOpen,
  onClose,
  onDelete,
}: DeleteBusModalProps) {
  const handleDelete = () => {
    if (mockTrips.some((t) => t.busId === bus.id)) {
      toast.error("Cannot delete bus with assigned trips. Delete trips first.");
      return;
    }
    onDelete(bus.id);
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Bus</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the bus operated by {bus.operator}?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
