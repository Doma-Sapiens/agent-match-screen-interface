import { useState } from "react";
import { Copy } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { StatusSelect } from "./StatusSelect";
import { AddressMapModal } from "./AddressMapModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

interface BuyerCardProps {
  id: string;
  name: string;
  budget?: string;
  budgetFrom?: string;
  budgetTo?: string;
  district?: string;
  address?: string;
  rooms: number;
  status: "Актуален" | "Актуализировать" | "В работе";
  matchCount?: number;
  buyerId?: string;
  phone?: string;
  desiredAreaFrom?: string;
  desiredAreaTo?: string;
  isHighlighted?: boolean;
  isSelected?: boolean;
  isDimmed?: boolean;
  interactionStatus?: string;
  showMatchCount?: boolean;
  onHover?: (isHovering: boolean) => void;
  onSelect?: () => void;
  onCall?: () => void;
  onMessage?: () => void;
  onScheduleShow?: () => void;
  onInteractionStatusChange?: (status: string) => void;
  onAddressClick?: () => void;
}

export function BuyerCard({
  id,
  name,
  budget,
  budgetFrom,
  budgetTo,
  district,
  address,
  rooms,
  status,
  matchCount,
  buyerId,
  phone,
  desiredAreaFrom,
  desiredAreaTo,
  isHighlighted = false,
  isSelected = false,
  isDimmed = false,
  interactionStatus = "",
  showMatchCount = true,
  onHover,
  onSelect,
  onCall,
  onMessage,
  onScheduleShow,
  onInteractionStatusChange,
  onAddressClick
}: BuyerCardProps) {
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showFullPhone, setShowFullPhone] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);

  const handleAddressClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddressClick) {
      onAddressClick();
    } else {
      setShowAddressModal(true);
    }
  };

  const handleCopyId = (e: React.MouseEvent, idValue: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(idValue);
    toast.success(`ID ${idValue} скопирован`);
  };

  const handleCardClick = () => {
    setShowBuyerModal(true);
  };

  // Формируем бюджет
  const budgetDisplay = budgetFrom && budgetTo 
    ? `от ${budgetFrom} до ${budgetTo}`
    : budget;

  // Формируем желаемую площадь
  const desiredAreaDisplay = desiredAreaFrom && desiredAreaTo
    ? `от ${desiredAreaFrom} до ${desiredAreaTo}`
    : null;

  return (
    <>
      <Card 
        className={`border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md ${
          isHighlighted ? 'ring-2 ring-blue-500 shadow-lg' : ''
        } ${
          isSelected ? 'ring-2 ring-blue-600 bg-blue-50' : ''
        } ${
          isDimmed ? 'opacity-50' : ''
        }`}
        onMouseEnter={() => onHover?.(true)}
        onMouseLeave={() => onHover?.(false)}
        onClick={handleCardClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <h4 className="text-gray-900">
                    {name}
                    {buyerId && (
                      <span className="inline-flex items-center gap-1 ml-1">
                        <span 
                          className="text-[#1976D2] cursor-pointer hover:underline"
                          onClick={(e) => handleCopyId(e, buyerId)}
                        >
                          (id {buyerId})
                        </span>
                        <Copy 
                          className="w-3.5 h-3.5 text-[#1976D2] cursor-pointer hover:text-[#1565C0]" 
                          onClick={(e) => handleCopyId(e, buyerId)}
                        />
                      </span>
                    )}
                  </h4>
                  {phone && (
                    <div className="text-sm text-gray-600 mt-1">
                      {showFullPhone ? phone : phone.slice(0, 8) + '...'}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowFullPhone(!showFullPhone);
                        }}
                        className="text-blue-600 hover:text-blue-700 ml-1"
                      >
                        {showFullPhone ? 'скрыть' : 'показать'}
                      </button>
                    </div>
                  )}
                </div>
                {onInteractionStatusChange && (
                  <StatusSelect
                    value={interactionStatus}
                    onValueChange={onInteractionStatusChange}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={status === "Актуален" || status === "В работе" ? "default" : "secondary"}
                  className={
                    status === "Актуален" || status === "В работе"
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-700"
                  }
                >
                  {status}
                </Badge>
                {matchCount && showMatchCount && (
                  <Badge className="bg-blue-100 text-blue-800">
                    {matchCount} совпадения
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Бюджет:</span>
              <span className="text-gray-900">{budgetDisplay}</span>
            </div>
            {(address || district) && (
              <div className="flex justify-between">
                <span>{address ? 'Адрес:' : 'Район:'}</span>
                {address ? (
                  <button 
                    onClick={handleAddressClick}
                    className="text-blue-600 hover:text-blue-700 hover:underline text-right"
                  >
                    {address}
                  </button>
                ) : (
                  <span className="text-gray-900">{district}</span>
                )}
              </div>
            )}
            {desiredAreaDisplay && (
              <div className="flex justify-between">
                <span>Желаемая площадь:</span>
                <span className="text-gray-900">{desiredAreaDisplay}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Комнат:</span>
              <span className="text-gray-900">{rooms}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Модалка карты */}
      <AddressMapModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        address={address || district || ""}
      />

      {/* Модалка просмотра заявки */}
      <Dialog open={showBuyerModal} onOpenChange={setShowBuyerModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Просмотр заявки</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-center">
              Стандартная карточка просмотра своей заявки
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}