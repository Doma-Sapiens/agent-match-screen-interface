import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Search,
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ChatItem {
  id: string;
  agentName: string;
  agentAvatar: string;
  propertyAddress: string;
  buyerName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  status?: string;
}

interface ChatSidebarProps {
  chats: ChatItem[];
  currentChatId: string;
  onChatSelect: (chatId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function ChatSidebar({
  chats,
  currentChatId,
  onChatSelect,
  isCollapsed,
  onToggleCollapse,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      chat.agentName.toLowerCase().includes(query) ||
      chat.propertyAddress.toLowerCase().includes(query) ||
      chat.buyerName.toLowerCase().includes(query)
    );
  });

  if (isCollapsed) {
    return (
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4 hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </Button>

        <div className="flex flex-col gap-2 mt-4">
          {chats.slice(0, 5).map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`relative w-10 h-10 rounded-full overflow-hidden border-2 transition-colors ${
                currentChatId === chat.id
                  ? "border-[#318bff]"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <ImageWithFallback
                src={chat.agentAvatar}
                alt={chat.agentName}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Заголовок */}
      <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-[#318bff]" />
          <h3 className="text-gray-900">
            Чаты ({chats.length})
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </Button>
      </div>

      {/* Поиск */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Поиск по чатам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Список чатов */}
      <ScrollArea className="flex-1">
        <div className="divide-y divide-gray-100">
          {filteredChats.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-400">
              <p className="text-[14px]">Нет чатов</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  currentChatId === chat.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex gap-3">
                  {/* Аватар */}
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                      <ImageWithFallback
                        src={chat.agentAvatar}
                        alt={chat.agentName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Информация о чате */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] text-gray-900 truncate">
                        {chat.agentName}
                      </span>
                      <span className="text-[11px] text-gray-500 flex-shrink-0 ml-2">
                        {chat.lastMessageTime}
                      </span>
                    </div>

                    <div className="text-[12px] text-gray-600 truncate mb-1">
                      {chat.propertyAddress}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12px] text-gray-400 truncate flex-1">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}