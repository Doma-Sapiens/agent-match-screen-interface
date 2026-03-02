import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Switch } from "./ui/switch";

interface NotificationsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationsEnabled: boolean;
  onToggleNotifications: (enabled: boolean) => void;
}

export function NotificationsSettingsModal({
  isOpen,
  onClose,
  notificationsEnabled,
  onToggleNotifications,
}: NotificationsSettingsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Управление уведомлениями о новых парах</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <p className="text-[14px] text-gray-600 leading-relaxed">
            Получайте уведомления, когда система находит подходящие пары для ваших объектов и заявок.
            Вы можете включить или отключить автоматические предложения.
          </p>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1">
              <p className="text-[14px] font-medium text-gray-900 mb-1">
                Получать предложения от системы
              </p>
              <p className="text-[12px] text-gray-500">
                Автоматические уведомления о новых совпадениях
              </p>
            </div>
            <Switch
              checked={notificationsEnabled}
              onCheckedChange={onToggleNotifications}
              className="ml-4"
            />
          </div>

          <p className="text-[12px] text-gray-500 italic">
            Вы всегда можете изменить этот параметр позже
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
