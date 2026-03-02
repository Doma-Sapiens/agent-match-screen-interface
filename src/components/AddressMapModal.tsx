import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";

interface AddressMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: string;
}

export function AddressMapModal({ isOpen, onClose, address }: AddressMapModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Адрес на карте</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-gray-900 mb-4">{address}</div>
          
          {/* Заглушка для карты */}
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
            <div className="text-center text-gray-500">
              <div className="mb-2">🗺️</div>
              <div>Здесь будет интерактивная карта</div>
              <div className="text-sm mt-2">{address}</div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Закрыть
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
