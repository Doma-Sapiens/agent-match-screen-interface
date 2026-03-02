import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";

interface CreateDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function CreateDealModal({ isOpen, onClose, onContinue }: CreateDealModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Создать сделку</DialogTitle>
          <DialogDescription className="text-gray-600 pt-2 leading-relaxed">
            Здесь вы можете сформировать информацию о предстоящей сделке и передать её в ХАБ 
            "Самолет Плюс", где менеджеры и юристы безопасно проведут сделку для клиентов.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-3 sm:gap-3 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-200 text-gray-700 hover:bg-gray-50 flex-1 sm:flex-initial"
          >
            Отмена
          </Button>
          <Button
            onClick={onContinue}
            className="bg-[#1976D2] hover:bg-[#1565C0] text-white flex-1 sm:flex-initial"
          >
            Продолжить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
