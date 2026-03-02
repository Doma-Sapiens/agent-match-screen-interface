import { useState } from "react";
import { ChevronDown, ChevronRight, MessageCircle, Phone, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { StatusSelect } from "./StatusSelect";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface Buyer {
  id: string;
  name: string;
  budget: string;
  district: string;
  rooms: number;
  status: string;
}

interface PropertyFolder {
  id: string;
  address: string;
  price: string;
  totalMatches: number;
  dealPotential: string;
  buyers: Buyer[];
}

interface PropertyFoldersViewProps {
  onMessage: (buyerId: string) => void;
  onCall: (buyerId: string) => void;
  onScheduleShow: (buyerId: string) => void;
  onStatusChange: (buyerId: string, status: string) => void;
}

export function PropertyFoldersView({ 
  onMessage, 
  onCall, 
  onScheduleShow, 
  onStatusChange 
}: PropertyFoldersViewProps) {
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    "property-1": true
  });

  const [propertyFolders, setPropertyFolders] = useState<PropertyFolder[]>([
    {
      id: "property-1",
      address: "ул. Невский проспект, 100",
      price: "6 200 000 ₽",
      totalMatches: 3,
      dealPotential: "6 200 000 ₽",
      buyers: [
        {
          id: "buyer-1",
          name: "Сергей Ким",
          budget: "6 000 000 ₽",
          district: "Центральный",
          rooms: 2,
          status: "proposed"
        },
        {
          id: "buyer-2", 
          name: "Дмитрий Орлов",
          budget: "7 500 000 ₽",
          district: "Центральный",
          rooms: 2,
          status: "scheduled"
        },
        {
          id: "buyer-3",
          name: "Елена Волкова",
          budget: "5 200 000 ₽",
          district: "Центральный",
          rooms: 2,
          status: ""
        }
      ]
    },
    {
      id: "property-2",
      address: "наб. реки Мойки, 45",
      price: "5 800 000 ₽", 
      totalMatches: 2,
      dealPotential: "5 800 000 ₽",
      buyers: [
        {
          id: "buyer-4",
          name: "Михаил Сидоров",
          budget: "8 000 000 ₽",
          district: "Центральный",
          rooms: 2,
          status: "contacted"
        },
        {
          id: "buyer-5",
          name: "Анна Петрова",
          budget: "4 500 000 ₽",
          district: "Центральный", 
          rooms: 1,
          status: "irrelevant"
        }
      ]
    },
    {
      id: "property-3",
      address: "ул. Рубинштейна, 23",
      price: "7 900 000 ₽",
      totalMatches: 1,
      dealPotential: "7 900 000 ₽",
      buyers: [
        {
          id: "buyer-6",
          name: "Владимир Козлов",
          budget: "8 500 000 ₽",
          district: "Центральный",
          rooms: 3,
          status: ""
        }
      ]
    }
  ]);

  const toggleFolder = (propertyId: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const handleStatusChange = (buyerId: string, newStatus: string) => {
    setPropertyFolders(prev => 
      prev.map(property => ({
        ...property,
        buyers: property.buyers.map(buyer => 
          buyer.id === buyerId ? { ...buyer, status: newStatus } : buyer
        )
      }))
    );
    onStatusChange(buyerId, newStatus);
  };

  const getVisibleBuyers = (buyers: Buyer[]) => {
    return buyers.filter(buyer => {
      const status = buyer.status;
      return !status || !["irrelevant", "closed"].includes(status);
    });
  };

  const getFolderStatus = (buyers: Buyer[]) => {
    const visibleBuyers = getVisibleBuyers(buyers);
    const inWork = visibleBuyers.filter(buyer => buyer.status && buyer.status !== "").length;
    const irrelevant = buyers.filter(buyer => {
      const status = buyer.status;
      return status && ["irrelevant", "closed"].includes(status);
    }).length;
    
    if (inWork === 0 && irrelevant === 0) return `${visibleBuyers.length} новых`;
    if (irrelevant === 0) return `${inWork} в работе`;
    return `${inWork} в работе, ${irrelevant} неактуально`;
  };

  return (
    <div className="space-y-4">
      {propertyFolders.map((property) => {
        const visibleBuyers = getVisibleBuyers(property.buyers);
        const isOpen = openFolders[property.id];
        
        return (
          <Card key={property.id} className="border border-gray-200">
            <Collapsible open={isOpen} onOpenChange={() => toggleFolder(property.id)}>
              <CollapsibleTrigger asChild>
                <div className="w-full p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                      )}
                      <div>
                        <h3 className="text-gray-900">
                          {property.address} — {property.totalMatches} совпадения
                        </h3>
                        <p className="text-sm text-gray-600">
                          потенциал {property.dealPotential}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {getFolderStatus(property.buyers)}
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="border-t border-gray-100">
                  <div className="p-4 space-y-4">
                    {visibleBuyers.map((buyer) => (
                      <Card key={buyer.id} className="border border-gray-100">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-gray-900">{buyer.name}</h4>
                                <StatusSelect
                                  value={buyer.status}
                                  onValueChange={(status) => handleStatusChange(buyer.id, status)}
                                />
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                <div>
                                  <span className="text-gray-500">Бюджет:</span>
                                  <span className="text-gray-900 ml-2">{buyer.budget}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Район:</span>
                                  <span className="text-gray-900 ml-2">{buyer.district}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Комнат:</span>
                                  <span className="text-gray-900 ml-2">{buyer.rooms}</span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onMessage(buyer.id)}
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Написать
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onCall(buyer.id)}
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                  <Phone className="w-4 h-4 mr-2" />
                                  Позвонить
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onScheduleShow(buyer.id)}
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Назначить показ
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {visibleBuyers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <p>Нет активных покупателей</p>
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        );
      })}
    </div>
  );
}