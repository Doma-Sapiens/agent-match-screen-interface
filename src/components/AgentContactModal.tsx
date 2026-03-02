import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Phone, MessageSquare } from "lucide-react";
import { useState } from "react";

interface AgentContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agentAgency: string;
  agentAvatar: string;
  agentPhone: string;
  agentTelegram?: string;
  agentWhatsApp?: string;
  onCall: (openChatAfter: boolean) => void;
}

export function AgentContactModal({
  isOpen,
  onClose,
  agentName,
  agentAgency,
  agentAvatar,
  agentPhone,
  agentTelegram,
  agentWhatsApp,
  onCall
}: AgentContactModalProps) {
  const [openChatAfter, setOpenChatAfter] = useState(true);

  const handleCall = () => {
    onCall(openChatAfter);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Связаться с агентом</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Информация об агенте */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
              <ImageWithFallback
                src={agentAvatar}
                alt={agentName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-gray-900 mb-1">{agentName}</h3>
              <p className="text-gray-600">{agentAgency}</p>
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-3">
            <a 
              href={`tel:${agentPhone}`}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-600" />
              <span className="text-gray-900">{agentPhone}</span>
            </a>
            
            {agentTelegram && (
              <a 
                href={agentTelegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">Telegram</span>
              </a>
            )}
            
            {agentWhatsApp && (
              <a 
                href={agentWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">WhatsApp</span>
              </a>
            )}
          </div>

          {/* Информационный текст */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              После звонка мы создадим чат по этой паре. Скажите, что нашли контакт в TnL.
            </p>
          </div>

          {/* Чекбокс */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="open-chat"
              checked={openChatAfter}
              onCheckedChange={(checked) => setOpenChatAfter(checked as boolean)}
            />
            <label
              htmlFor="open-chat"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Открыть чат после звонка
            </label>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3">
            <Button 
              onClick={handleCall}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Позвонить
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}