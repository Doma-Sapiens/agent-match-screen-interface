import { useState } from "react";
import { X, Camera, FileText, CheckSquare, AlertCircle, Check } from "lucide-react";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface PropertyDetails {
  address: string;
  price: string;
  imageUrl: string;
}

interface SendToAdsModalProps {
  property: PropertyDetails;
  onClose: () => void;
  agentName?: string;
  agentAvatar?: string;
  date?: string;
}

interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  required: boolean;
  warning?: string;
}

export function SendToAdsModal({ property, onClose, agentName = "Собственная база", agentAvatar, date }: SendToAdsModalProps) {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: "required-fields",
      title: "Заполнить все обязательные поля",
      description: "Площадь, этаж, год постройки, состояние",
      completed: false,
      required: true
    },
    {
      id: "description",
      title: "Заполнить продающее описание",
      description: "Создайте привлекательное описание объекта",
      completed: true,
      required: false,
      warning: "Мы видим, что описание можно улучшить"
    },
    {
      id: "photos",
      title: "Сфотографировать квартиру",
      description: "Сделайте качественные фотографии всех помещений",
      completed: false,
      required: false
    }
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const allRequiredCompleted = checklist
    .filter(item => item.required)
    .every(item => item.completed);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Шапка */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {agentAvatar && (
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={agentAvatar}
                  alt={agentName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h2 className="text-gray-900">{agentName}</h2>
              {date && <p className="text-xs text-gray-500">📅 {date}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Информация об объекте */}
          <div className="mb-6">
            <h3 className="text-gray-900 mb-4">Информация об объекте</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              {/* Фото объекта - две картинки рядом */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="h-32 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={property.imageUrl}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="h-32 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={property.imageUrl}
                    alt={property.address}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Детали */}
              <div>
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-1">📍 Адрес</div>
                  <div className="text-gray-900">{property.address}</div>
                </div>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-600 mb-1">💰 Цена</div>
                  <div className="text-gray-900">{property.price}</div>
                </div>

                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Потенциал сделки</span>
                    <span className="font-semibold text-green-700">{property.price}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Чеклист действий */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-900">Чеклист подготовки</h3>
              <span className="text-sm text-gray-500">
                {checklist.filter(i => i.completed).length} из {checklist.length} выполнено
              </span>
            </div>
            
            <div className="space-y-3">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`border rounded-lg p-4 transition-all ${
                    item.warning 
                      ? "border-yellow-400 bg-yellow-50" 
                      : item.completed
                      ? "border-green-300 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Чекбокс */}
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        item.completed
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300 hover:border-gray-400 bg-white"
                      }`}
                    >
                      {item.completed && (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      )}
                    </button>

                    {/* Иконка */}
                    <div className={`mt-0.5 ${item.warning ? "text-yellow-600" : item.completed ? "text-green-600" : "text-gray-400"}`}>
                      {item.id === "photos" && <Camera className="w-5 h-5" />}
                      {item.id === "description" && <FileText className="w-5 h-5" />}
                      {item.id === "required-fields" && <CheckSquare className="w-5 h-5" />}
                    </div>

                    {/* Текст */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${item.completed ? "text-green-900" : "text-gray-900"}`}>
                          {item.title}
                        </span>
                        {item.required && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">
                            Обязательное
                          </span>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      )}

                      {item.warning && (
                        <div className="flex items-start gap-2 mt-2 text-sm text-yellow-800 bg-yellow-100 p-2 rounded border border-yellow-300">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{item.warning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Подсказка */}
          {!allRequiredCompleted && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  Заполните все обязательные поля, чтобы опубликовать объявление
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Закрыть
          </Button>
          
          <Button
            className="bg-[#1976D2] hover:bg-[#1565C0]"
            disabled={!allRequiredCompleted}
          >
            {allRequiredCompleted ? "Опубликовать объявление" : "Заполните обязательные поля"}
          </Button>
        </div>
      </div>
    </div>
  );
}
