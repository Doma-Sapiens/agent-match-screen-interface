import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface HiddenPair {
  id: string;
  type: "buyer" | "property";
  name: string;
  details: string;
  status: string;
  hiddenReason: string;
}

interface HiddenPairsViewProps {
  onRestore: (pairId: string) => void;
}

export function HiddenPairsView({ onRestore }: HiddenPairsViewProps) {
  const [hiddenPairs, setHiddenPairs] = useState<HiddenPair[]>([
    {
      id: "hidden-1",
      type: "buyer",
      name: "Анна Петрова",
      details: "Бюджет: 4 500 000 ₽ • Приморский район • 1 комната",
      status: "irrelevant",
      hiddenReason: "Неактуально"
    },
    {
      id: "hidden-2", 
      type: "property",
      name: "ул. Большая Морская, 15",
      details: "3 400 000 ₽ • 1-комнатная • 35 м²",
      status: "closed",
      hiddenReason: "Закрыто"
    },
    {
      id: "hidden-3",
      type: "buyer", 
      name: "Владимир Смирнов",
      details: "Бюджет: 9 000 000 ₽ • Центральный район • 3 комнаты",
      status: "irrelevant",
      hiddenReason: "Неактуально"
    },
    {
      id: "hidden-4",
      type: "property",
      name: "наб. Фонтанки, 78",
      details: "8 200 000 ₽ • 2-комнатная • 72 м²",
      status: "closed", 
      hiddenReason: "Закрыто"
    }
  ]);

  const handleRestore = (pairId: string) => {
    setHiddenPairs(prev => prev.filter(pair => pair.id !== pairId));
    onRestore(pairId);
  };

  const getStatusColor = (status: string) => {
    return status === "closed" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800";
  };

  const getTypeLabel = (type: string) => {
    return type === "buyer" ? "Покупатель" : "Объект";
  };

  if (hiddenPairs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg text-gray-900 mb-2">Нет скрытых пар</h3>
        <p className="text-gray-600">Все пары в активной работе</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Информационное сообщение */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 mt-0.5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-blue-900 mb-1">Скрытые пары</h3>
            <p className="text-blue-800 text-sm">
              Эти пары были скрыты. Вы можете вернуть их в работу.
            </p>
          </div>
        </div>
      </div>

      {/* Список скрытых пар */}
      <div className="space-y-4">
        {hiddenPairs.map((pair) => (
          <Card key={pair.id} className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-xs text-gray-500 uppercase tracking-wide">
                      {getTypeLabel(pair.type)}
                    </div>
                    <Badge className={getStatusColor(pair.status)}>
                      {pair.hiddenReason}
                    </Badge>
                  </div>
                  
                  <h4 className="text-gray-900 mb-1">{pair.name}</h4>
                  <p className="text-sm text-gray-600">{pair.details}</p>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRestore(pair.id)}
                  className="ml-4 border-green-200 text-green-700 hover:bg-green-50 hover:border-green-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Восстановить
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Статистика */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="text-sm text-gray-600">
          Всего скрыто: <span className="text-gray-900">{hiddenPairs.length}</span>
          {" • "}
          Неактуально: <span className="text-gray-900">
            {hiddenPairs.filter(p => p.status === "irrelevant").length}
          </span>
          {" • "}
          Закрыто: <span className="text-gray-900">
            {hiddenPairs.filter(p => p.status === "closed").length}
          </span>
        </div>
      </div>
    </div>
  );
}