import { useState } from "react";
import { MessageCircle, Phone } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { StatusSelect } from "./StatusSelect";

interface Deal {
  id: string;
  property: string;
  buyer: string;
  matchCount: number;
  dealPotential: string;
  status: string;
}

interface DealsTableViewProps {
  onMessage: (dealId: string) => void;
  onCall: (dealId: string) => void;
  onStatusChange: (dealId: string, status: string) => void;
}

export function DealsTableView({ onMessage, onCall, onStatusChange }: DealsTableViewProps) {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: "deal-1",
      property: "ул. Невский пр., 100",
      buyer: "Сергей Ким",
      matchCount: 2,
      dealPotential: "6 200 000 ₽",
      status: "proposed"
    },
    {
      id: "deal-2", 
      property: "наб. реки Мойки, 45",
      buyer: "Дмитрий Орлов",
      matchCount: 1,
      dealPotential: "5 800 000 ₽",
      status: "scheduled"
    },
    {
      id: "deal-3",
      property: "ул. Рубинштейна, 23",
      buyer: "Михаил Сидоров", 
      matchCount: 1,
      dealPotential: "7 900 000 ₽",
      status: "contacted"
    },
    {
      id: "deal-4",
      property: "ул. Невский пр., 100",
      buyer: "Елена Волкова",
      matchCount: 1,
      dealPotential: "6 200 000 ₽", 
      status: ""
    }
  ]);

  const visibleDeals = deals.filter(deal => {
    const status = deal.status;
    return !status || !["irrelevant", "closed"].includes(status);
  });
  
  const totalPotential = visibleDeals.reduce((sum, deal) => {
    const amount = parseInt(deal.dealPotential.replace(/[^\d]/g, ''));
    return sum + amount;
  }, 0);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₽';
  };

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      "proposed": "Предложен объект",
      "contacted": "Связался",
      "scheduled": "Назначен показ",
      "irrelevant": "Неактуально",
      "closed": "Закрыто",
      "": "—"
    };
    return statusLabels[status] || "—";
  };

  const handleStatusChange = (dealId: string, newStatus: string) => {
    setDeals(prev => 
      prev.map(deal => 
        deal.id === dealId ? { ...deal, status: newStatus } : deal
      )
    );
    onStatusChange(dealId, newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок с потенциалом */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h3 className="text-lg text-gray-900 mb-1">Потенциал сделок</h3>
        <div className="text-2xl text-blue-600">
          {formatAmount(totalPotential)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {visibleDeals.length} активных пар
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="text-gray-900">Объект</TableHead>
              <TableHead className="text-gray-900">Покупатель</TableHead>
              <TableHead className="text-center text-gray-900">Совпадения</TableHead>
              <TableHead className="text-right text-gray-900">Потенциал сделки</TableHead>
              <TableHead className="text-gray-900">Статус</TableHead>
              <TableHead className="text-center text-gray-900">Действие</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleDeals.map((deal) => (
              <TableRow 
                key={deal.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <TableCell className="text-gray-900">
                  {deal.property}
                </TableCell>
                <TableCell className="text-gray-900">
                  {deal.buyer}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    {deal.matchCount}
                  </span>
                </TableCell>
                <TableCell className="text-right text-gray-900">
                  {deal.dealPotential}
                </TableCell>
                <TableCell>
                  <StatusSelect
                    value={deal.status}
                    onValueChange={(status) => handleStatusChange(deal.id, status)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    {deal.status === "scheduled" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onCall(deal.id)}
                        className="text-xs"
                      >
                        <Phone className="w-3 h-3 mr-1" />
                        Позвонить
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMessage(deal.id)}
                        className="text-xs"
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Написать
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {visibleDeals.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p>Нет активных пар для отображения</p>
        </div>
      )}
    </div>
  );
}