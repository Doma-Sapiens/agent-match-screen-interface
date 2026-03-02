import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { X, Phone, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";

interface AgentContactModalTableProps {
  isOpen: boolean;
  onClose: () => void;
  agent: {
    id: number;
    name: string;
    avatar: string;
    company: string;
    phone: string;
    email: string;
  };
}

export function AgentContactModalTable({
  isOpen,
  onClose,
  agent,
}: AgentContactModalTableProps) {
  const handleCall = () => {
    window.open(`tel:${agent.phone}`, "_self");
  };

  const copyPhone = () => {
    navigator.clipboard.writeText(agent.phone);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-white rounded-lg overflow-hidden">
        {/* Заголовок */}
        <DialogHeader className="p-4 pb-3 bg-white border-b border-gray-100 flex flex-row items-center justify-between space-y-0">
          <div className="flex flex-col">
            <DialogTitle className="text-[14px] text-gray-600">
              id сотрудника: {agent.id}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Контактная информация агента {agent.name}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Контент */}
        <div className="p-4 space-y-4">
          {/* Информация об агенте */}
          <div className="flex items-start gap-3">
            <img
              src={agent.avatar}
              alt={agent.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="text-[16px] font-medium text-gray-900 mb-1">
                {agent.name}
              </h3>
              <p className="text-[13px] text-gray-600 mb-1">
                МКЗ Агент
              </p>
              <p className="text-[13px] text-gray-500">
                Компания: {agent.company}
              </p>
            </div>
          </div>

          {/* Контактная информация */}
          <div className="space-y-3 pt-3 border-t border-gray-100">
            {/* Телефон */}
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-[13px] text-gray-600">
                  Рабочий телефон: {agent.phone}{" "}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <MessageCircle className="w-4 h-4 text-blue-500" />
              <div className="flex-1">
                <p className="text-[13px] text-gray-600">
                  Почта: {agent.email}
                </p>
              </div>
            </div>
          </div>

          {/* Действия */}
          <div className="space-y-2 pt-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto text-blue-500 hover:text-blue-600 hover:bg-blue-50"
              onClick={handleCall}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Написать сообщение
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start p-2 h-auto text-blue-500 hover:text-blue-600 hover:bg-blue-50"
            >
              <Send className="w-4 h-4 mr-2" />
              Переслать контакты
            </Button>
          </div>

          {/* Дополнительная информация */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4" />{" "}
              {/* Placeholder для иконки */}
              <p className="text-[13px] text-gray-500">
                Сотрудник не указал информацию о себе
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}