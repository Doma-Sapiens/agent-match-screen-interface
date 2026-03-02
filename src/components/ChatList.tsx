import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ChatItem {
  id: string;
  agent: {
    name: string;
    avatar: string;
  };
  property: {
    address: string;
    price: string;
  };
  buyer: {
    name: string;
  };
  lastMessage: string;
  lastMessageTime: string;
  status: string;
}

interface ChatListProps {
  chats: ChatItem[];
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ chats, onChatSelect }: ChatListProps) {
  if (chats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>Нет активных обсуждений</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {chats.map((chat) => (
        <Card 
          key={chat.id}
          className="border border-gray-200 transition-all duration-200 cursor-pointer hover:shadow-md hover:border-blue-300"
          onClick={() => onChatSelect(chat.id)}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Аватар агента */}
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                <ImageWithFallback
                  src={chat.agent.avatar}
                  alt={chat.agent.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Основная информация */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-gray-900 mb-1">{chat.agent.name}</h4>
                    <div className="text-sm text-gray-600">
                      {chat.property.address} • {chat.property.price}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 flex-shrink-0">
                    {chat.lastMessageTime}
                  </div>
                </div>

                {/* Последнее сообщение */}
                <div className="text-sm text-gray-700 mb-2 truncate">
                  {chat.lastMessage}
                </div>

                {/* Статус */}
                <Badge 
                  variant="secondary"
                  className="text-xs bg-blue-100 text-blue-800"
                >
                  {chat.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}