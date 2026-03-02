import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Phone, MessageCircle, Calendar } from "lucide-react";
import { StatusSelect } from "./StatusSelect";

interface PropertyCardProps {
  id: string;
  imageUrl: string;
  address: string;
  price: string;
  rooms: number;
  status: "В рекламе" | "В работе";
  district?: string;
  floor?: string;
  area?: string;
  matchCount?: number;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  interactionStatus?: string;
  onHover?: (isHovering: boolean) => void;
  onSelect?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
  onScheduleShow?: () => void;
  onInteractionStatusChange?: (status: string) => void;
}

export function PropertyCard({
  id,
  imageUrl,
  address,
  price,
  rooms,
  status,
  district = "Центральный",
  floor = "3/9",
  area = "65 м²",
  matchCount,
  isHighlighted = false,
  isSelected = false,
  isDimmed = false,
  interactionStatus = "",
  onHover,
  onSelect,
  onCall,
  onMessage,
  onScheduleShow,
  onInteractionStatusChange
}: PropertyCardProps) {
  return (
    <Card 
      className={`border border-gray-200 transition-all duration-200 ${
        isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''
      } ${
        isSelected ? 'ring-2 ring-blue-600 bg-blue-50' : ''
      } ${
        isDimmed ? 'opacity-50' : ''
      }`}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Левая колонка - фото */}
          <div className="w-60 flex-shrink-0">
            <div className="relative">
              <ImageWithFallback
                src={imageUrl}
                alt={`Объект ${address}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                <Badge 
                  className={status === "В рекламе" 
                    ? "bg-green-100 text-green-800 text-xs" 
                    : "bg-blue-100 text-blue-800 text-xs"
                  }
                >
                  {status}
                </Badge>
                {matchCount && matchCount > 0 && (
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    Совпадений: {matchCount}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          {/* Правая колонка - контент */}
          <div className="flex-1">
            {/* Заголовок и цена */}
            <div className="mb-3">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-gray-900 flex-1">{address}</h4>
                {onInteractionStatusChange && (
                  <StatusSelect
                    value={interactionStatus}
                    onValueChange={onInteractionStatusChange}
                    className="ml-2"
                  />
                )}
              </div>
              <div className="text-xl text-gray-900 mb-2">{price}</div>
              <div className="text-gray-600">{rooms}-комнатная квартира</div>
            </div>

            {/* Характеристики */}
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
              <div>
                <span className="text-gray-500">Район:</span>
                <span className="text-gray-900 ml-1">{district}</span>
              </div>
              <div>
                <span className="text-gray-500">Этаж:</span>
                <span className="text-gray-900 ml-1">{floor}</span>
              </div>
              <div>
                <span className="text-gray-500">Площадь:</span>
                <span className="text-gray-900 ml-1">{area}</span>
              </div>
            </div>

            {/* Действия */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onCall?.();
                }}
              >
                <Phone className="w-4 h-4 mr-2" />
                Позвонить
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onMessage?.();
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Написать
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onScheduleShow?.();
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Назначить показ
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}