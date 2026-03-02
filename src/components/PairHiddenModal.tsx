import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface PairHiddenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PairHiddenModal({ isOpen, onClose }: PairHiddenModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Подборка скрыта</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-gray-600">
            Вы можете увидеть ее в разделе "Скрытые пары"
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={onClose}
            className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
          >
            Понятно
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
