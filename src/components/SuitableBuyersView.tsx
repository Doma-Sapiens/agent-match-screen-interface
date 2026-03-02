import { useState } from "react";
import { X } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CommissionProposalModal } from "./CommissionProposalModal";

interface SuitableBuyersViewProps {
  onStartCommunication: (commission: number, message: string) => void;
  onOpenChat: () => void;
}

export function SuitableBuyersView({ onStartCommunication, onOpenChat }: SuitableBuyersViewProps) {
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
  const [showActionsPopup, setShowActionsPopup] = useState(false);

  const handleCommissionSubmit = (commission: number, message: string) => {
    onStartCommunication(commission, message);
    setShowCommissionModal(false);
    setSelectedBuyers([]);
  };

  const handleBuyerSelect = (buyerId: string, checked: boolean) => {
    if (checked) {
      setSelectedBuyers([...selectedBuyers, buyerId]);
    } else {
      setSelectedBuyers(selectedBuyers.filter(id => id !== buyerId));
    }
  };

  const handlePrintSelected = () => {
    console.log("Печать выбранных:", selectedBuyers);
    setShowActionsPopup(false);
  };

  const handleOfferProperty = () => {
    setShowActionsPopup(false);
    setShowCommissionModal(true);
  };

  const handleClearSelection = () => {
    setSelectedBuyers([]);
    setShowActionsPopup(false);
  };

  return (
    <>
      <div className="bg-[rgb(242,248,255)] min-h-screen p-6">
        {/* Верхний баннер */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Badge className="bg-[#1976D2] text-white px-4 py-1.5 rounded-full">
                Подходящие покупатели - 7
              </Badge>
              <span className="text-gray-600">Показ - 0</span>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Информационный блок */}
          <div className="bg-[rgb(255,255,255)] border border-blue-200 rounded-lg p-4 text-sm text-[rgb(73,136,224)]">
            В этом разделе выводятся покупатели, которые подходят под параметры данного объекта недвижимости. 
            Поиск подходящих покупателей работает только по критериям со страницы "Фильма". В разделах "Сота 
            доска детальные" и "Для совместного агентства в работе".
          </div>
        </div>

        {/* Информация об объекте */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
              <span className="text-gray-400 text-xs">ID</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-500">ID: 11348963</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-900">Продажа квартиры</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-900">2M-234 кв м</span>
              </div>
              <div className="text-gray-900">
                г. Санкт-Петербург, Центральный р-н, наб. Кутузовская, 1
              </div>
            </div>
          </div>
        </div>

        {/* Фильтры */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-4 text-sm">
            <label className="px-3 py-1.5 bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer">
              <input type="radio" name="buyer-filter" defaultChecked className="w-4 h-4 text-[rgb(255,255,255)]" />
              <span>Мои заявки - 5</span>
            </label>
            <label className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
              <input type="radio" name="buyer-filter" className="w-4 h-4" />
              <span className="text-blue-600">Взаимное колничество - 7</span>
            </label>
            <label className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
              <input type="radio" name="buyer-filter" className="w-4 h-4" />
              <span>Базе твоей заявки - 0</span>
            </label>
            <label className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
              <input type="radio" name="buyer-filter" className="w-4 h-4" />
              <span>От контрагентов - 0</span>
            </label>
            <label className="px-3 py-1.5 rounded hover:bg-gray-100 transition-colors flex items-center gap-2 cursor-pointer">
              <input type="radio" name="buyer-filter" className="w-4 h-4" />
              <span>MLS - 0</span>
            </label>
          </div>
        </div>

        {/* Таблица покупателей */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Заголовок таблицы */}
          <div className="border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs text-gray-600">
              <div className="col-span-1">Ответственный</div>
              <div className="col-span-1">Контакты</div>
              <div className="col-span-1">Обработка</div>
              <div className="col-span-1">Тип объекта</div>
              <div className="col-span-1">Комиссия</div>
              <div className="col-span-1">Локация</div>
              <div className="col-span-1">Метро</div>
              <div className="col-span-1">Площадь</div>
              <div className="col-span-1">Вид</div>
              <div className="col-span-1">Ремонт</div>
              <div className="col-span-1">Этажи</div>
              <div className="col-span-1">Обс</div>
            </div>
          </div>

          {/* Строка данных */}
          <div className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="grid grid-cols-12 gap-4 px-4 py-4 text-sm">
              <div className="col-span-1">
                <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300 w-4 h-4"
                    checked={selectedBuyers.includes("buyer-1")}
                    onChange={(e) => handleBuyerSelect("buyer-1", e.target.checked)}
                  />
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xs text-blue-600">
                    ВХ
                  </div>
                </div>
              </div>
              <div className="col-span-1">
                <div className="flex flex-col gap-1">
                  <span className="text-blue-600">+7-943-...78</span>
                  <button className="text-xs text-blue-600 hover:underline">
                    Написать собщение
                  </button>
                </div>
              </div>
              <div className="col-span-1">
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Не обработана
                </Badge>
              </div>
              <div className="col-span-1 text-gray-900">
                Квартира 2M
              </div>
              <div className="col-span-1 text-gray-600">
                нет
              </div>
              <div className="col-span-1">
                <button className="text-blue-600 hover:underline text-xs">
                  Обновить-то сейчас
                </button>
              </div>
              <div className="col-span-1 text-gray-600">
                —
              </div>
              <div className="col-span-1 text-gray-600">
                —
              </div>
              <div className="col-span-1 text-gray-600">
                —
              </div>
              <div className="col-span-1 text-gray-600">
                —
              </div>
              <div className="col-span-1 text-gray-600">
                —
              </div>
              <div className="col-span-1 text-gray-600">
                —
              </div>
            </div>
          </div>

          {/* Дополнительные строки */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500">ID: 41 483 0456</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Стадия: 26.08.2025, 12:10</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600">Изм: 29.08.2025, 03:05</span>
            </div>
          </div>

          {/* Кнопки внизу таблицы */}
          <div className="px-4 py-3 bg-gray-50 flex items-center justify-end">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>Всего: 7</span>
            </div>
          </div>
        </div>
      </div>

      {/* Фиксированная кнопка выбора внизу страницы */}
      {selectedBuyers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="relative">
            <Button
              variant="default"
              size="lg"
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white shadow-lg gap-2 px-6 py-3"
              onClick={() => setShowActionsPopup(!showActionsPopup)}
            >
              Выбрано: {selectedBuyers.length}
              <X 
                className="w-4 h-4 ml-1 hover:bg-white/20 rounded-full p-0.5 cursor-pointer" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearSelection();
                }}
              />
            </Button>
            
            {/* Попап с действиями */}
            {showActionsPopup && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white rounded-lg shadow-xl border border-gray-200 p-2 min-w-[200px]">
                <button
                  onClick={handlePrintSelected}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Печать выбранных
                </button>
                <button
                  onClick={handleOfferProperty}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Предложить объект
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Модалка предложения комиссии */}
      <CommissionProposalModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        onSubmit={handleCommissionSubmit}
        buyerName={selectedBuyers.length === 1 ? "Георгий Белоусов" : `${selectedBuyers.length} покупателям`}
        propertyAddress="ул. Литейный проспект, 56"
      />
    </>
  );
}
