import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronLeft, ChevronRight, TrainFront, Copy } from "lucide-react";
import { CommissionProposalModal } from "./CommissionProposalModal";
import { PairHiddenModal } from "./PairHiddenModal";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { AddressMapModal } from "./AddressMapModal";
import { toast } from "sonner@2.0.3";

interface MatchingSuitableBuyersViewProps {
  myProperty: {
    id: string;
    imageUrl: string;
    address: string;
    price: string;
    rooms: number;
    district: string;
    floor: string;
    area: string;
  };
  partnerBuyers: Array<{
    id: string;
    name: string;
    budget: string;
    district: string;
    rooms: number;
    status: "В работе" | "Актуализировать";
    hasActiveChat?: boolean;
  }>;
  onStartCommunication: (buyerId: string, commission: number, message: string) => void;
  onOpenChat: (buyerId: string) => void;
  onHidePair?: () => void;
}

export function MatchingSuitableBuyersView({
  myProperty,
  partnerBuyers,
  onStartCommunication,
  onOpenChat,
  onHidePair
}: MatchingSuitableBuyersViewProps) {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [hiddenPairs, setHiddenPairs] = useState<string[]>([]);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showHiddenModal, setShowHiddenModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState<any>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  // Пары моих объектов с подходящими покупателями
  const propertyPairs = [
    {
      property: {
        ...myProperty,
        propertyId: "22040456",
        metro: "Чернышевская",
        pricePerMeter: "285 714 ₽",
        status: "В работе" as const,
        description: "Просторная квартира в историческом центре города. Высокие потолки, большие окна, отличная планировка. Рядом с метро, развитая инфраструктура...",
        commissionShare: "2% от суммы, за которую будет продан объект"
      },
      buyers: partnerBuyers.map(buyer => ({
        ...buyer,
        buyerId: buyer.id === "partner-buyer-1" ? "13050678" : buyer.id === "partner-buyer-2" ? "13050679" : "13050680",
        budgetFrom: buyer.budget.split("—")[0]?.trim() || "6 000 000 ₽",
        budgetTo: buyer.budget.split("—")[1]?.trim() || "7 000 000 ₽",
        address: "Санкт-Петербург, Центральный р-н...",
        phone: "+7 981 123-45-67",
        desiredAreaFrom: "55 кв м",
        desiredAreaTo: "75 кв м"
      }))
    },
    {
      property: {
        id: "my-property-2",
        propertyId: "22040457",
        imageUrl: "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        address: "Санкт-Петербург, ул. Пушкина, 15",
        metro: "Гостиный двор",
        price: "5 900 000 ₽",
        pricePerMeter: "270 642 ₽",
        rooms: 2,
        status: "В работе" as const,
        district: "Центральный",
        floor: "4/10",
        area: "62 м²",
        description: "Уютная двухкомнатная квартира после косметического ремонта. Отличное расположение в центре города, рядом с основными достопримечательностями...",
        commissionShare: "50% от полученной агентом комиссии"
      },
      buyers: [
        {
          id: "partner-buyer-4",
          buyerId: "13050681",
          name: "Алексей Соловьёв",
          budgetFrom: "5 500 000 ₽",
          budgetTo: "6 500 000 ₽",
          budget: "6 000 000 ₽",
          address: "Санкт-Петербург, Адмиралтейский р-н...",
          district: "Центральный",
          rooms: 2,
          status: "В работе" as const,
          hasActiveChat: false,
          phone: "+7 981 234-56-78",
          desiredAreaFrom: "55 кв м",
          desiredAreaTo: "70 кв м"
        }
      ]
    },
    {
      property: {
        id: "my-property-3",
        propertyId: "22040458",
        imageUrl: "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        address: "Санкт-Петербург, пр. Космонавтов, 78",
        metro: "Московская",
        price: "8 200 000 ₽",
        pricePerMeter: "286 315 ₽",
        rooms: 3,
        status: "В работе" as const,
        district: "Московский",
        floor: "7/16",
        area: "95 м²",
        description: "Просторная трехкомнатная квартира в современном жилом комплексе. Панорамные окна, современная планировка, парковочное место в подземном паркинге...",
        commissionShare: "агент указал, что не готов делиться комиссией. Но вы можете обсудить с ним условия"
      },
      buyers: [
        {
          id: "partner-buyer-5",
          buyerId: "13050682",
          name: "Ольга Николаева",
          budgetFrom: "8 000 000 ₽",
          budgetTo: "9 000 000 ₽",
          budget: "8 500 000 ₽",
          address: "Санкт-Петербург, Московский р-н...",
          district: "Московский",
          rooms: 3,
          status: "В работе" as const,
          hasActiveChat: false,
          phone: "+7 981 345-67-89",
          desiredAreaFrom: "85 кв м",
          desiredAreaTo: "105 кв м"
        },
        {
          id: "partner-buyer-6",
          buyerId: "13050683",
          name: "Павел Морозов",
          budgetFrom: "7 500 000 ₽",
          budgetTo: "8 500 000 ₽",
          budget: "8 000 000 ₽",
          address: "Санкт-Петербург, Фрунзенский р-н...",
          district: "Московский, Фрунзенский",
          rooms: 3,
          status: "В работе" as const,
          hasActiveChat: false,
          phone: "+7 981 456-78-90",
          desiredAreaFrom: "80 кв м",
          desiredAreaTo: "100 кв м"
        }
      ]
    }
  ];

  // Фильтруем скрытые пары
  const visiblePairs = propertyPairs.filter(pair => !hiddenPairs.includes(pair.property.id));
  const currentPair = visiblePairs[currentPairIndex];

  const handleCopyPropertyId = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(propertyId);
    toast.success("ID объекта скопирован");
  };

  const handleCopyBuyerId = (e: React.MouseEvent, buyerId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(buyerId);
    toast.success(`ID ${buyerId} скопирован`);
  };

  const handleStartCommunication = () => {
    setShowCommissionModal(true);
  };

  const handleCommissionSubmit = (commission: number, message: string) => {
    // Передаем первого покупателя или общий идентификатор
    if (currentPair) {
      onStartCommunication(currentPair.buyers[0]?.id || "all", commission, message);
    }
    setShowCommissionModal(false);
  };

  const handleHidePairClick = () => {
    setShowHiddenModal(true);
  };

  const handleModalClose = () => {
    setShowHiddenModal(false);
    
    // Скрываем текущую пару
    if (currentPair) {
      setHiddenPairs(prev => [...prev, currentPair.property.id]);
    }
  };

  const handlePrevPair = () => {
    setCurrentPairIndex(prev => (prev > 0 ? prev - 1 : visiblePairs.length - 1));
  };

  const handleNextPair = () => {
    setCurrentPairIndex(prev => (prev < visiblePairs.length - 1 ? prev + 1 : 0));
  };

  const handleAddressClick = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    setSelectedAddress(address);
    setShowMapModal(true);
  };

  // Если нет видимых пар
  if (!currentPair) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Все подборки просмотрены</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-12">
        {/* Левая колонка - Мой объект */}
        <div className="flex-1">
          <h3 className="text-gray-900 mb-4">Мой объект</h3>
          
          {/* Карточка с навигацией */}
          <div className="flex items-center gap-4">
            {/* Кнопка влево */}
            <Button
              onClick={handlePrevPair}
              variant="outline"
              size="icon"
              className="flex-shrink-0 h-10 w-10 border-gray-300 hover:bg-gray-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Карточка объекта */}
            <Card 
              className="border border-gray-200 flex-1 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setShowPropertyModal(true)}
            >
              <CardContent className="p-6">
                {/* Фото объекта */}
                <div className="relative mb-4">
                  <ImageWithFallback
                    src={currentPair.property.imageUrl}
                    alt={currentPair.property.address}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-blue-100 text-blue-800">
                      {currentPair.property.status}
                    </Badge>
                  </div>
                </div>

                {/* Информация об объекте */}
                <div className="space-y-3">
                  {/* Тип объекта с ID */}
                  <div className="text-gray-900 flex items-center gap-1 flex-wrap">
                    <span>{currentPair.property.rooms}-комнатная квартира</span>
                    <span className="inline-flex items-center gap-1">
                      <span 
                        className="text-[#1976D2] cursor-pointer hover:underline"
                        onClick={(e) => handleCopyPropertyId(e, currentPair.property.propertyId)}
                      >
                        (id {currentPair.property.propertyId})
                      </span>
                      <Copy 
                        className="w-3.5 h-3.5 text-[#1976D2] cursor-pointer hover:text-[#1565C0]" 
                        onClick={(e) => handleCopyPropertyId(e, currentPair.property.propertyId)}
                      />
                    </span>
                  </div>

                  {/* Адрес */}
                  <div className="text-gray-900">{currentPair.property.address}</div>

                  {/* Метро */}
                  <div className="flex items-center gap-2 text-gray-600">
                    <TrainFront className="w-4 h-4 text-blue-600" />
                    <span>{currentPair.property.metro}</span>
                  </div>

                  {/* Цена */}
                  <div className="space-y-1 pt-2">
                    <div className="text-2xl text-gray-900">{currentPair.property.price}</div>
                    <div className="text-sm text-gray-500">{currentPair.property.pricePerMeter} за м²</div>
                  </div>
                  
                  {/* Характеристики */}
                  <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                    <div>
                      <span className="text-gray-500">Район:</span>
                      <span className="text-gray-900 ml-2">{currentPair.property.district}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Этаж:</span>
                      <span className="text-gray-900 ml-2">{currentPair.property.floor}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Площадь:</span>
                      <span className="text-gray-900 ml-2">{currentPair.property.area}</span>
                    </div>
                  </div>

                  {/* Описание */}
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {currentPair.property.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Кнопка вправо */}
            <Button
              onClick={handleNextPair}
              variant="outline"
              size="icon"
              className="flex-shrink-0 h-10 w-10 border-gray-300 hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Правая колонка - Покупатели встречного агента */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Подходящие покупатели агента Олеси</h3>
            
            <div className="flex gap-2">
              <Button
                onClick={handleStartCommunication}
                className="bg-[#43A047] hover:bg-[#388E3C] text-white"
              >
                Начать общение
              </Button>
              <Button
                onClick={handleHidePairClick}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Скрыть пары
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentPair.buyers.map((buyer) => (
              <Card
                key={buyer.id}
                className="border border-gray-200 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all"
                onClick={() => {
                  setSelectedBuyer(buyer);
                  setShowBuyerModal(true);
                }}
              >
                <CardContent className="p-5">
                  {/* Заголовок с именем и статусом */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-gray-900 mb-2 flex items-center gap-1 flex-wrap">
                        <span>{buyer.name}</span>
                        <span className="inline-flex items-center gap-1">
                          <span 
                            className="text-[#1976D2] cursor-pointer hover:underline"
                            onClick={(e) => handleCopyBuyerId(e, buyer.buyerId)}
                          >
                            (id {buyer.buyerId})
                          </span>
                          <Copy 
                            className="w-3.5 h-3.5 text-[#1976D2] cursor-pointer hover:text-[#1565C0]" 
                            onClick={(e) => handleCopyBuyerId(e, buyer.buyerId)}
                          />
                        </span>
                      </div>
                      <Badge 
                        className="bg-green-100 text-green-800"
                      >
                        {buyer.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Основная информация */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Бюджет</div>
                      <div className="text-gray-900">
                        {buyer.budgetFrom} — {buyer.budgetTo}
                      </div>
                    </div>

                    <div 
                      className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 hover:underline"
                      onClick={(e) => handleAddressClick(e, buyer.address)}
                    >
                      {buyer.address}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Комнат:</span>
                        <span className="ml-2 text-gray-900">{buyer.rooms}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Желаемая площадь:</span>
                        <span className="ml-2 text-gray-900">{buyer.desiredAreaFrom} — {buyer.desiredAreaTo}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Модалка предложения комиссии */}
      <CommissionProposalModal
        isOpen={showCommissionModal}
        onClose={() => {
          setShowCommissionModal(false);
        }}
        onSubmit={handleCommissionSubmit}
        buyerName="агенту"
        propertyAddress={currentPair.property.address}
      />

      {/* Модалка подтверждения скрытия */}
      <PairHiddenModal
        isOpen={showHiddenModal}
        onClose={handleModalClose}
      />

      {/* Модалка с картой */}
      <AddressMapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        address={selectedAddress}
      />

      {/* Модалка просмотра объекта */}
      <Dialog open={showPropertyModal} onOpenChange={setShowPropertyModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Просмотр объекта</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-center">
              Стандартная карточка просмотра объекта через МЛС
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Модалка просмотра заявки покупателя */}
      <Dialog open={showBuyerModal} onOpenChange={setShowBuyerModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Просмотр заявки</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600 text-center">
              Стандартная карточка просмотра заявки через МЛС
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
