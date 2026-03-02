import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";

interface CommissionProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (commission: number, message: string) => void;
  buyerName: string;
  propertyAddress: string;
}

export function CommissionProposalModal({
  isOpen,
  onClose,
  onSubmit,
  buyerName,
  propertyAddress
}: CommissionProposalModalProps) {
  const [commission, setCommission] = useState<string>("10");
  const [message, setMessage] = useState<string>(
    "Здравствуйте! У вас есть покупатели, которым подходит мой объект. Предлагаю, обсудить возможность сотрудничества"
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Получаем дефолтную комиссию из localStorage
    const defaultCommission = localStorage.getItem("defaultCompanyCommission");
    if (defaultCommission) {
      setCommission(defaultCommission);
    }
  }, [isOpen]);

  const handleCommissionChange = (value: string) => {
    setError("");
    setCommission(value);
    
    const numValue = parseFloat(value);
    if (value && (isNaN(numValue) || numValue < 0 || numValue > 100)) {
      setError("Комиссия должна быть от 0 до 100");
    }
  };

  const handleSubmit = () => {
    const numValue = parseFloat(commission);
    
    if (!commission || isNaN(numValue) || numValue < 0 || numValue > 100) {
      setError("Введите корректное значение комиссии (0-100)");
      return;
    }

    onSubmit(numValue, message);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Предложить разделить комиссию</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 mt-4">
          <p className="text-sm text-gray-600">
            {buyerName === "покупателям" ? (
              <>
                Вы видите покупателей, подходящих под ваш объект.
                <br />
                Ваша компания установила дефолтную комиссию <span className="font-medium text-gray-900">{commission || "10"} %</span> — вы можете изменить её перед отправкой.
              </>
            ) : (
              <>
                Ваша компания установила дефолтную комиссию <span className="font-medium text-gray-900">{commission || "10"} %</span>.
                <br />
                Вы можете изменить размер комиссии для этого предложения.
              </>
            )}
          </p>

          {/* Поле комиссии */}
          <div className="space-y-2">
            <Label htmlFor="commission" className="text-gray-700">Размер комиссии</Label>
            <div className="relative">
              <Input
                id="commission"
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={commission}
                onChange={(e) => handleCommissionChange(e.target.value)}
                placeholder="Введите процент"
                className={`pr-10 ${error ? "border-red-300" : ""}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-sm">
                %
              </div>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Поле сообщения */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-700">Сообщение</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="resize-none"
              placeholder="Введите ваше сообщение..."
            />
            <p className="text-xs text-gray-500">Это сообщение будет отправлено агенту вместе с предложением комиссии</p>
          </div>

          {/* Информация о предложении */}
          {buyerName !== "покупателям" && buyerName !== "агенту" && (
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Покупатель:</span> {buyerName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Объект:</span> {propertyAddress}
              </p>
            </div>
          )}
          {(buyerName === "покупателям" || buyerName === "агенту") && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-900">Объект:</span> {propertyAddress}
              </p>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-600"
            >
              Отмена
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={!!error}
            >
              Отправить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
