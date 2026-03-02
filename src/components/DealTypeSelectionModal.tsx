import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface DealTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  onContinue: (dealType: "full-cycle" | "registration-payment") => void;
}

export function DealTypeSelectionModal({ 
  isOpen, 
  onClose, 
  onBack,
  onContinue 
}: DealTypeSelectionModalProps) {
  const [selectedType, setSelectedType] = useState<"full-cycle" | "registration-payment" | null>(null);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] bg-white p-0">
        {/* Шапка */}
        <DialogHeader className="border-b border-gray-200 pb-4 px-6 pt-6 space-y-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-gray-900 text-xl">Выберите тип сделки</DialogTitle>
            <span className="text-sm text-gray-500">Шаг 1/7</span>
          </div>
          <DialogDescription className="sr-only">
            Выберите один из доступных типов сделки для продолжения оформления
          </DialogDescription>
        </DialogHeader>

        {/* Карточки выбора */}
        <div className="space-y-4 py-6 px-6">
          {/* Сделка полного цикла */}
          <Card
            className={`p-5 cursor-pointer transition-all duration-200 border-2 hover:border-[#1976D2] hover:shadow-md ${
              selectedType === "full-cycle"
                ? "border-[#1976D2] bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setSelectedType("full-cycle")}
          >
            <div className="flex items-start gap-4">
              {/* Чекбокс/индикатор выбора */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                selectedType === "full-cycle"
                  ? "bg-[#1976D2] border-[#1976D2]"
                  : "bg-white border-gray-300"
              }`}>
                {selectedType === "full-cycle" && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-gray-900 mb-2 font-medium">Сделка полного цикла</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Проведение сделки полного цикла, включая формирование пакета документов 
                  по сделке юристами офиса или Хаба.
                </p>
              </div>
            </div>
          </Card>

          {/* Регистрация / Расчёты / Титул */}
          <Card
            className={`p-5 cursor-pointer transition-all duration-200 border-2 hover:border-[#1976D2] hover:shadow-md ${
              selectedType === "registration-payment"
                ? "border-[#1976D2] bg-blue-50 shadow-sm"
                : "border-gray-200 bg-white"
            }`}
            onClick={() => setSelectedType("registration-payment")}
          >
            <div className="flex items-start gap-4">
              {/* Чекбокс/индикатор выбора */}
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                selectedType === "registration-payment"
                  ? "bg-[#1976D2] border-[#1976D2]"
                  : "bg-white border-gray-300"
              }`}>
                {selectedType === "registration-payment" && (
                  <Check className="w-3.5 h-3.5 text-white" />
                )}
              </div>

              <div className="flex-1">
                <h3 className="text-gray-900 mb-2 font-medium">Регистрация / Расчёты / Титул</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Оформление электронной регистрации, безопасных расчётов 
                  и титульного страхования.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Футер с кнопками */}
        <div className="flex items-center justify-between pt-4 pb-6 px-6 border-t border-gray-200">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          
          <Button
            onClick={() => selectedType && onContinue(selectedType)}
            disabled={!selectedType}
            className="bg-[#1976D2] hover:bg-[#1565C0] text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Продолжить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
