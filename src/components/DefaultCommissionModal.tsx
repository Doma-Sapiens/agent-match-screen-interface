import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface DefaultCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    commission: number | null,
    dontShowAgain: boolean,
  ) => void;
}

export function DefaultCommissionModal({
  isOpen,
  onClose,
  onSave,
}: DefaultCommissionModalProps) {
  const [commission, setCommission] = useState<string>("");
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [error, setError] = useState<string>("");

  const handleCommissionChange = (value: string) => {
    setError("");

    // Разрешаем пустое поле
    if (value === "") {
      setCommission("");
      return;
    }

    // Разрешаем только цифры и точку
    if (!/^\d*\.?\d*$/.test(value)) {
      return;
    }

    const numValue = parseFloat(value);

    // Проверяем диапазон 0-100
    if (!isNaN(numValue) && (numValue < 0 || numValue > 100)) {
      setError("Значение должно быть от 0 до 100");
      return;
    }

    setCommission(value);
  };

  const handleSave = () => {
    if (commission === "") {
      // Пустое поле - не сохраняем значение
      onSave(null, dontShowAgain);
    } else {
      const numValue = parseFloat(commission);
      if (isNaN(numValue) || numValue < 0 || numValue > 100) {
        setError("Введите корректное значение от 0 до 100");
        return;
      }
      onSave(numValue, dontShowAgain);
    }

    // Сбрасываем состояние
    setCommission("");
    setDontShowAgain(false);
    setError("");
  };

  const handleCancel = () => {
    // Закрываем без сохранения
    setCommission("");
    setDontShowAgain(false);
    setError("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            Установите дефолтную комиссию компании
          </DialogTitle>
          <DialogDescription className="pt-2">
            Укажите, какой процент комиссии ваша компания готова
            делиться со встречными агентами по умолчанию. Это
            поможет агентам понимать корпоративную политику
            взаимодействия.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="commission">
              Процент комиссии по умолчанию
            </Label>
            <div className="relative">
              <Input
                id="commission"
                type="text"
                placeholder="Введите процент"
                value={commission}
                onChange={(e) =>
                  handleCommissionChange(e.target.value)
                }
                className="pr-8"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                %
              </span>
            </div>
            {error && (
              <p className="text-xs text-red-600">{error}</p>
            )}
            <p className="text-xs text-gray-500">
              Введите 0, если компания не готова делиться
              комиссией.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="dont-show"
              checked={dontShowAgain}
              onCheckedChange={(checked) =>
                setDontShowAgain(checked as boolean)
              }
            />
            <label
              htmlFor="dont-show"
              className="text-sm text-gray-700 cursor-pointer select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Больше не показывать
            </label>
          </div>
        </div>

        <DialogFooter className="flex-col gap-3">
          <div className="flex gap-2 w-full sm:justify-end">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex-1 sm:flex-initial"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[rgba(69,97,255,0.88)] hover:bg-green-700 flex-1 sm:flex-initial text-[rgb(255,255,255)]"
            >
              Сохранить
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-center sm:text-right w-full">
            Вы всегда можете изменить этот параметр в настройках
            компании.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}