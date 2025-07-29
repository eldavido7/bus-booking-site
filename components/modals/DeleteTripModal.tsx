import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";

interface DeleteTripModalProps {
  trip: { id: string; operator: string; from: string; to: string };
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function DeleteTripModal({
  trip,
  isOpen,
  onClose,
  onDelete,
}: DeleteTripModalProps) {
  const handleDelete = () => {
    onDelete(trip.id);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Trip</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the trip from {trip.from} to{" "}
            {trip.to} operated by {trip.operator}? This action cannot be undone.
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
