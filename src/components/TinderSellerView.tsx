import { useState } from "react";
import { MessageCircle, Phone, ChevronLeft, ChevronRight, TrainFront, Copy } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { BuyerCard } from "./BuyerCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { CommissionProposalModal } from "./CommissionProposalModal";
import { PairHiddenModal } from "./PairHiddenModal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner@2.0.3";

interface TinderSellerViewProps {
  onMessage: (buyerId: string) => void;
  onCall: (buyerId: string) => void;
  onLike?: (propertyId: string) => void;
  onDislike?: (propertyId: string) => void;
  onStartCommunication?: (propertyId: string, commission: number, message: string) => void;
  onHidePair?: () => void;
}

export function TinderSellerView({ onMessage, onCall, onLike, onDislike, onStartCommunication, onHidePair }: TinderSellerViewProps) {
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [hiddenProperties, setHiddenProperties] = useState<string[]>([]);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [showHiddenModal, setShowHiddenModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  // Пары объектов с подходящими покупателями
  const propertyPairs = [
    {
      property: {
        id: "property-1",
        propertyId: "12030325",
        imageUrl: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        address: "Санкт-Петербург, ул. Невский проспект, 100",
        metro: "Василеостровская",
        price: "6 200 000 ₽",
        pricePerMeter: "303 371 ₽",
        rooms: 2,
        status: "В работе" as const,
        district: "Центральный",
        floor: "3/9",
        area: "65 м²",
        description: "Предлагаю Вашему вниманию евро 3-х комнатные апартаменты в комплексе бизнес-класса «Наследие на Марата» от застройщика «Новая линия» по адресу Подъездной переулок, дом 12, расположенную на 7-м этаже 8-ти этажного...",
        commissionShare: "1,5% от суммы, за которую будет продан объект"
      },
      buyers: [
        {
          id: "buyer-1",
          name: "Сергей Ким",
          budgetFrom: "5 500 000 ₽",
          budgetTo: "6 500 000 ₽",
          address: "Волгоградская обл., Городищенский р-н...",
          rooms: 2,
          status: "В работе" as const,
          buyerId: "12030325",
          phone: "+7 981 234-56-78",
          desiredAreaFrom: "45 кв м",
          desiredAreaTo: "70 кв м"
        },
        {
          id: "buyer-5",
          name: "Дмитрий Орлов",
          budgetFrom: "7 000 000 ₽",
          budgetTo: "8 000 000 ₽",
          address: "Московская обл., Подольский р-н...",
          rooms: 2,
          status: "В работе" as const,
          buyerId: "12030326",
          phone: "+7 981 345-67-89",
          desiredAreaFrom: "50 кв м",
          desiredAreaTo: "75 кв м"
        }
      ]
    },
    {
      property: {
        id: "property-2",
        propertyId: "12030326",
        imageUrl: "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        address: "Санкт-Петербург, наб. реки Мойки, 45",
        metro: "Невский проспект",
        price: "5 800 000 ₽",
        pricePerMeter: "285 123 ₽",
        rooms: 2,
        status: "В работе" as const,
        district: "Центральный",
        floor: "2/8",
        area: "58 м²",
        description: "Уютная двухкомнатная квартира с видом на Мойку в историческом центре города. Квартира полностью готова к проживанию, выполнен качественный ремонт с использованием современных материалов...",
        commissionShare: "50% от полученной агентом комиссии"
      },
      buyers: [
        {
          id: "buyer-1",
          name: "Сергей Ким",
          budgetFrom: "5 500 000 ₽",
          budgetTo: "6 500 000 ₽",
          address: "Волгоградская обл., Городищенский р-н...",
          rooms: 2,
          status: "В работе" as const,
          buyerId: "12030325",
          phone: "+7 981 234-56-78",
          desiredAreaFrom: "45 кв м",
          desiredAreaTo: "70 кв м"
        },
        {
          id: "buyer-4",
          name: "Елена Волкова",
          budgetFrom: "5 000 000 ₽",
          budgetTo: "5 500 000 ₽",
          address: "Ленинградская обл., Всеволожский р-н...",
          rooms: 2,
          status: "В работе" as const,
          buyerId: "12030327",
          phone: "+7 981 456-78-90",
          desiredAreaFrom: "40 кв м",
          desiredAreaTo: "60 кв м"
        }
      ]
    },
    {
      property: {
        id: "property-3",
        propertyId: "12030327",
        imageUrl: "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        address: "Санкт-Петербург, ул. Рубинштейна, 23",
        metro: "Достоевская",
        price: "7 900 000 ₽",
        pricePerMeter: "338 905 ₽",
        rooms: 3,
        status: "В работе" as const,
        district: "Центральный",
        floor: "5/12",
        area: "85 м²",
        description: "Просторная трехкомнатная квартира в престижном районе на улице Рубинштейна. Высокие потолки, большие окна, отличная планировка. Дом находится в самом центре культурной жизни города...",
        commissionShare: "20 000 рублей"
      },
      buyers: [
        {
          id: "buyer-3",
          name: "Михаил Сидоров",
          budgetFrom: "7 500 000 ₽",
          budgetTo: "8 500 000 ₽",
          address: "Краснодарский край, Динской р-н...",
          rooms: 3,
          status: "В работе" as const,
          buyerId: "12030328",
          phone: "+7 981 567-89-01",
          desiredAreaFrom: "75 кв м",
          desiredAreaTo: "95 кв м"
        }
      ]
    },
    {
      property: {
        id: "property-4",
        propertyId: "12030328",
        imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBiZWRyb29tfGVufDF8fHx8MTc1OTkxNzEzNnww&ixlib=rb-4.1.0&q=80&w=1080",
        address: "Санкт-Петербург, пр. Просвещения, 84",
        metro: "Просвещения",
        price: "4 500 000 ₽",
        pricePerMeter: "225 000 ₽",
        rooms: 1,
        status: "В работе" as const,
        district: "Калининский",
        floor: "8/16",
        area: "48 м²",
        description: "Современная однокомнатная квартира в новом жилом комплексе. Отличная инфраструктура района, рядом метро, торговые центры и парки. Квартира с отделкой от застройщика...",
        commissionShare: "агент указал, что не готов делиться комиссией. Но вы можете обсудить с ним условия"
      },
      buyers: [
        {
          id: "buyer-6",
          name: "Татьяна Смирнова",
          budgetFrom: "4 000 000 ₽",
          budgetTo: "5 000 000 ₽",
          address: "Санкт-Петербург, Калининский р-н...",
          rooms: 1,
          status: "В работе" as const,
          buyerId: "12030329",
          phone: "+7 981 678-90-12",
          desiredAreaFrom: "40 кв м",
          desiredAreaTo: "55 кв м"
        }
      ]
    }
  ];

  // Фильтруем скрытые пары
  const visiblePairs = propertyPairs.filter(pair => !hiddenProperties.includes(pair.property.id));
  const currentPair = visiblePairs[currentPropertyIndex];

  const handleCopyPropertyId = (e: React.MouseEvent, propertyId: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(propertyId);
    toast.success("ID объекта скопирован");
  };

  const handleStartCommunication = () => {
    setShowCommissionModal(true);
  };

  const handleCommissionSubmit = (commission: number, message: string) => {
    if (currentPair && onStartCommunication) {
      onStartCommunication(currentPair.property.id, commission, message);
    }
    setShowCommissionModal(false);
  };

  const handleHidePair = () => {
    setShowHiddenModal(true);
  };

  const handleModalClose = () => {
    setShowHiddenModal(false);
    
    // Скрываем текущую пару
    if (currentPair) {
      setHiddenProperties(prev => [...prev, currentPair.property.id]);
    }
  };

  const handlePrevPair = () => {
    setCurrentPropertyIndex(prev => (prev > 0 ? prev - 1 : visiblePairs.length - 1));
  };

  const handleNextPair = () => {
    setCurrentPropertyIndex(prev => (prev < visiblePairs.length - 1 ? prev + 1 : 0));
  };

  if (!currentPair) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Все объекты просмотрены</p>
      </div>
    );
  }

  const currentProperty = currentPair.property;
  const suitableBuyers = currentPair.buyers;

  return (
    <>
      <div className="flex gap-8 h-full">
        {/* Левая часть - Список покупателей */}
        <div className="w-1/2">
          <h3 className="text-gray-900 mb-4">Подходящие заявки</h3>
          <div className="space-y-4">
            {suitableBuyers.map((buyer) => (
              <BuyerCard
                key={buyer.id}
                {...buyer}
                showMatchCount={false}
                onHover={() => {}}
                onCall={() => onCall(buyer.id)}
                onMessage={() => onMessage(buyer.id)}
                onScheduleShow={() => {}}
              />
            ))}
          </div>
        </div>

        {/* Правая часть - Карточка объекта */}
        <div className="w-1/2 space-y-6">
          {/* Кнопки над объектом */}
          <div className="flex items-center justify-between">
            <h3 className="text-gray-900">Объект агента Олеси</h3>
            <div className="flex gap-2">
              <Button
                onClick={handleStartCommunication}
                className="bg-[#43A047] hover:bg-[#388E3C] text-white"
              >
                Начать общение
              </Button>
              <Button
                onClick={handleHidePair}
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Скрыть пары
              </Button>
            </div>
          </div>

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
                  src={currentProperty.imageUrl}
                  alt={currentProperty.address}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-blue-100 text-blue-800">
                    {currentProperty.status}
                  </Badge>
                </div>
              </div>

              {/* Информация об объекте */}
              <div className="space-y-3">
                {/* Тип объекта с ID */}
                <div className="text-gray-900 flex items-center gap-1 flex-wrap">
                  <span>{currentProperty.rooms}-комнатная квартира</span>
                  <span className="inline-flex items-center gap-1">
                    <span 
                      className="text-[#1976D2] cursor-pointer hover:underline"
                      onClick={(e) => handleCopyPropertyId(e, currentProperty.propertyId)}
                    >
                      (id {currentProperty.propertyId})
                    </span>
                    <Copy 
                      className="w-3.5 h-3.5 text-[#1976D2] cursor-pointer hover:text-[#1565C0]" 
                      onClick={(e) => handleCopyPropertyId(e, currentProperty.propertyId)}
                    />
                  </span>
                </div>

                {/* Адрес */}
                <div className="text-gray-900">{currentProperty.address}</div>

                {/* Метро */}
                <div className="flex items-center gap-2 text-gray-600">
                  <TrainFront className="w-4 h-4 text-blue-600" />
                  <span>{currentProperty.metro}</span>
                </div>

                {/* Цена */}
                <div className="space-y-1 pt-2">
                  <div className="text-2xl text-gray-900">{currentProperty.price}</div>
                  <div className="text-sm text-gray-500">{currentProperty.pricePerMeter} за м²</div>
                </div>
                
                {/* Характеристики */}
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                  <div>
                    <span className="text-gray-500">Район:</span>
                    <span className="text-gray-900 ml-2">{currentProperty.district}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Этаж:</span>
                    <span className="text-gray-900 ml-2">{currentProperty.floor}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Площадь:</span>
                    <span className="text-gray-900 ml-2">{currentProperty.area}</span>
                  </div>
                </div>

                {/* Готовность делиться комиссией */}
                <div className="pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-1">
                    Готов делиться комиссией со встречным агентом:
                  </div>
                  <div className="text-sm text-gray-900">
                    {currentProperty.commissionShare}
                  </div>
                </div>

                {/* Описание */}
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {currentProperty.description}
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
      </div>

      {/* Модалка предложения комиссии */}
      <CommissionProposalModal
        isOpen={showCommissionModal}
        onClose={() => setShowCommissionModal(false)}
        onSubmit={handleCommissionSubmit}
        buyerName="агенту"
        propertyAddress={currentProperty.address}
      />

      {/* Модалка подтверждения скрытия */}
      <PairHiddenModal
        isOpen={showHiddenModal}
        onClose={handleModalClose}
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
    </>
  );
}