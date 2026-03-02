import { useState } from "react";
import { ArrowLeft, Users, PlusCircle, Send, Paperclip, Smile, MoreVertical } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AgencyDirectorChatProps {
  onBack: () => void;
  agency: {
    name: string;
    director: string;
    email: string;
    phone: string;
    logo: string;
  };
  myAgency: string;
}

export function AgencyDirectorChat({ onBack, agency, myAgency }: AgencyDirectorChatProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "1",
      type: "system" as const,
      text: "Здравствуйте! Видим перспективный метч между нашими агентствами. Предлагаем обсудить детали сотрудничества.",
      timestamp: "14:30",
      isOwn: false
    }
  ]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        type: "user" as const,
        text: message.trim(),
        timestamp: new Date().toLocaleTimeString("ru", { 
          hour: "2-digit", 
          minute: "2-digit" 
        }),
        isOwn: true
      };
      setMessages(prev => [...prev, newMessage]);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1419] flex flex-col text-white">
      {/* Шапка чата */}
      <div className="border-b border-gray-700 px-6 py-4 bg-[#0f1419]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-gray-400 hover:text-white hover:bg-gray-800 p-2"
            >
              <ArrowLeft className="w-4 h-4 text-white" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-medium">
                ОО
              </div>
              <div>
                <h2 className="text-white">
                  Обсуждение общих пар
                </h2>
                <p className="text-gray-400 text-sm">
                  2 участника
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <Users className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-gray-800">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Информация о приватности */}
      <div className="px-6 py-4 text-center">
        <div className="inline-flex items-center gap-2 text-sm text-gray-400">
          <div className="w-4 h-4">🔒</div>
          <span>Приватный чат. Внимание ваши сообщения защищены шифрованием.</span>
          <button className="text-blue-400 hover:text-blue-300">Подробнее</button>
        </div>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Дата СЕГОДНЯ */}
        <div className="text-center">
          <span className="text-gray-400 text-sm">СЕГОДНЯ</span>
        </div>
        
        {/* Сообщение о создании группы */}
        <div className="text-center">
          <div className="text-gray-400 text-sm">
            Максим Моторин создал(а) группу Обсуждение общих пар
          </div>
        </div>

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md ${
                msg.type === "system"
                  ? "bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm"
                  : msg.isOwn
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-white"
              } px-4 py-2 rounded-lg`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div
                className={`text-xs mt-1 ${
                  msg.type === "system"
                    ? "text-gray-500"
                    : msg.isOwn
                    ? "text-blue-200"
                    : "text-gray-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Панель ввода */}
      <div className="border-t border-gray-700 px-6 py-4 bg-[#0f1419]">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Введите текст..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                <Smile className="w-4 h-4" />
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white p-1 h-6 w-6"
              >
                <Send className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}