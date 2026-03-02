import { useState, useEffect } from "react";
import { ArrowLeft, Paperclip, Smile, Send, MoreVertical, Check, MessageCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ChatSidebar } from "./ChatSidebar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { CreateDealModal } from "./CreateDealModal";
import { DealTypeSelectionModal } from "./DealTypeSelectionModal";

interface ChatProps {
  onBack: () => void;
  buyer: {
    name: string;
    budget: string;
    district: string;
  };
  property: {
    imageUrl: string;
    address: string;
    price: string;
  };
  agent: {
    name: string;
    avatar: string;
  };
  myName?: string;
  chatType?: "buyer" | "seller";
  initialCommission?: number;
  initialMessage?: string;
  autoAcceptTerms?: boolean;
  taskProposal?: string;
  currentChatId?: string;
  allChats?: Array<{
    id: string;
    agentName: string;
    agentAvatar: string;
    propertyAddress: string;
    buyerName: string;
    lastMessage: string;
    lastMessageTime: string;
    unreadCount?: number;
    status?: string;
  }>;
  onChatSelect?: (chatId: string) => void;
}

export function Chat({ 
  onBack, 
  buyer, 
  property, 
  agent,
  myName = "Пётр Иванов",
  chatType = "buyer",
  initialCommission,
  initialMessage,
  autoAcceptTerms = false,
  taskProposal,
  currentChatId = "current",
  allChats = [],
  onChatSelect
}: ChatProps) {
  const [message, setMessage] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commissionType, setCommissionType] = useState("percent");
  const [commissionValue, setCommissionValue] = useState("");
  const [selectedBuyerForShow, setSelectedBuyerForShow] = useState("");
  const [fixedBuyerId, setFixedBuyerId] = useState<string>("");
  const [messages, setMessages] = useState<any[]>([]);
  const [commissionAgreed, setCommissionAgreed] = useState(false);
  const [showAgreed, setShowAgreed] = useState(false);
  const [termsFixed, setTermsFixed] = useState(false);
  const [showFixTermsDialog, setShowFixTermsDialog] = useState(false);
  const [showCreateDealModal, setShowCreateDealModal] = useState(false);
  const [showDealTypeModal, setShowDealTypeModal] = useState(false);
  const [communicationHistory, setCommunicationHistory] = useState<Array<{
    timestamp: string;
    text: string;
  }>>([]);
  const [processedProposals, setProcessedProposals] = useState<Set<number>>(new Set());

  // Автоматическая отправка сообщения при лайке
  useEffect(() => {
    if (messages.length === 0) {
      // Если открыт чат из системной задачи с предложением
      if (taskProposal) {
        const initialMessages = [
          {
            id: 1,
            type: "incoming",
            content: taskProposal,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: !autoAcceptTerms, // Показываем кнопки только если не автоприем
            proposalType: autoAcceptTerms ? undefined : "terms",
            hasActions: !autoAcceptTerms
          }
        ];
        
        // Если нужно автоматически принять условия
        if (autoAcceptTerms) {
          initialMessages.push({
            id: 2,
            type: "outgoing",
            content: "Принимаю ваши условия. Согласен на деление комиссии 50/50.",
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: false,
            proposalType: undefined
          });
          
          // Добавляем логи в историю коммуникации
          const now = new Date();
          const timestamp = now.toLocaleDateString('ru-RU', { 
            day: '2-digit', 
            month: '2-digit',
            year: 'numeric'
          }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
          
          setCommunicationHistory([
            {
              timestamp,
              text: `${agent.name} предложил деление комиссии 50/50.`
            },
            {
              timestamp,
              text: `${myName} согласился на условия: деление комиссии 50/50.`
            }
          ]);
        }
        
        setMessages(initialMessages);
      }
      // Если есть начальная комиссия и сообщение (из нового таба "Подходящие покупатели")
      else if (initialCommission !== undefined && initialMessage) {
        const initialMessages = [
          {
            id: 1,
            type: "system",
            content: `Агент Пётр Иванов предложил разделить комиссию — ${initialCommission} %. Условия зафиксируются после согласия второй стороны.`,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: false,
            proposalType: undefined
          },
          {
            id: 2,
            type: "outgoing",
            content: initialMessage,
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: false,
            proposalType: undefined
          }
        ];
        setMessages(initialMessages);
        
        // Добавляем в историю коммуникации
        const now = new Date();
        const timestamp = now.toLocaleDateString('ru-RU', { 
          day: '2-digit', 
          month: '2-digit',
          year: 'numeric'
        }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
        setCommunicationHistory([{
          timestamp,
          text: `Предложено деление комиссии: ${initialCommission} %, инициатор — Пётр Иванов.`
        }]);
      } else if (chatType === "seller") {
        const initialMessages = [
          {
            id: 1,
            type: "outgoing",
            content: "Здравствуйте! Интересует ваш объект. Давайте обсудим детали сделки.",
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: false,
            proposalType: undefined
          }
        ];

        // Добавляем демонстрационные входящие сообщения для показа функциональности
        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 2,
            type: "incoming",
            content: "💸 Предлагаю комиссию 50% за сделку",
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: true,
            proposalType: "commission"
          }]);
        }, 2000);

        setTimeout(() => {
          setMessages(prev => [...prev, {
            id: 3,
            type: "incoming",
            content: "📅 Предлагаю показ на 16.01.2025 в 15:00",
            timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
            isProposal: true,
            proposalType: "show"
          }]);
        }, 4000);

        setMessages(initialMessages);
      }
    }
  }, [chatType, initialCommission, initialMessage, autoAcceptTerms, taskProposal, agent.name]);

  const quickPhrases = chatType === "seller" ? [
    "Здравствуйте! По вашему покупателю есть подходящий объект.",
    "Готов обсудить комиссию.",
    "Назначим показ?",
    "Уточните, актуален ли запрос?"
  ] : [
    "Здравствуйте! Есть клиент под ваш объект.",
    "Удобно обсудить условия комиссии?",
    "Готов назначить показ на завтра 14:00. Подходит?",
    "Клиент уточнил вопросы, можно созвониться?",
    "Подтверждаю показ на завтра 14:00.",
    "Скиньте, пожалуйста, презентацию/ПД."
  ];

  const buyers = [
    { id: "buyer-1", name: "Сергей Ким" },
    { id: "buyer-2", name: "Анна Петрова" },
    { id: "buyer-3", name: "Михаил Сидоров" },
    { id: "buyer-4", name: "Елена Волкова" }
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMessage = {
      id: Date.now(),
      type: "outgoing",
      content: message,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isProposal: false,
      proposalType: undefined
    };
    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const handleQuickPhrase = (phrase: string) => {
    const newMessage = {
      id: Date.now(),
      type: "outgoing",
      content: phrase,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isProposal: false,
      proposalType: undefined
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleProposalAction = (messageId: number, action: "agree" | "discuss", proposalType?: string) => {
    // Отмечаем предложение как обработанное
    setProcessedProposals(prev => new Set([...prev, messageId]));
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    if (action === "agree") {
      const newMessage = {
        id: Date.now(),
        type: "outgoing",
        content: proposalType === "terms" ? "Принимаю ваши условия. Согласен на деление комиссии 50/50." : "✅ Согласен с предложением",
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isProposal: false,
        proposalType: undefined
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Отмечаем согласование
      if (proposalType === "commission") {
        setCommissionAgreed(true);
        setCommunicationHistory(prev => [...prev, {
          timestamp,
          text: "Комиссия согласована обеими сторонами."
        }]);
      } else if (proposalType === "show") {
        setShowAgreed(true);
        setCommunicationHistory(prev => [...prev, {
          timestamp,
          text: "Показ согласован обеими сторонами."
        }]);
      } else if (proposalType === "terms") {
        // Добавляем логи для фиксации условий
        setCommunicationHistory(prev => [...prev, 
          {
            timestamp,
            text: `${agent.name} предложил деление комиссии 50/50.`
          },
          {
            timestamp,
            text: `${myName} согласился на условия: деление комиссии 50/50.`
          }
        ]);
      }
    } else {
      const newMessage = {
        id: Date.now(),
        type: "outgoing",
        content: "💬 Давайте обсудим детали",
        timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        isProposal: false,
        proposalType: undefined
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleCommissionProposal = () => {
    if (!commissionValue || termsFixed) return;
    const proposalText = `💸 Предлагаю комиссию ${commissionValue}${commissionType === "percent" ? "%" : " ₽"} за сделку`;
    const newMessage = {
      id: Date.now(),
      type: "outgoing",
      content: proposalText,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isProposal: true,
      proposalType: "commission"
    };
    setMessages(prev => [...prev, newMessage]);
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setCommunicationHistory(prev => [...prev, {
      timestamp,
      text: `Пётр Иванов предложил деление комиссии ${commissionValue}${commissionType === "percent" ? "%" : " ₽"}.`
    }]);
    
    setCommissionValue("");
  };

  const handleShowProposal = () => {
    if (termsFixed && fixedBuyerId) return;
    const dateInput = document.querySelector('input[type="datetime-local"]') as HTMLInputElement;
    if (!dateInput?.value) return;
    
    const date = new Date(dateInput.value);
    const formattedDate = date.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const buyerName = selectedBuyerForShow ? buyers.find(b => b.id === selectedBuyerForShow)?.name : "";
    const buyerText = buyerName ? ` для ${buyerName}` : "";
    
    const proposalText = `📅 Предлагаю показ${buyerText} на ${formattedDate} в ${formattedTime}`;
    const newMessage = {
      id: Date.now(),
      type: "outgoing",
      content: proposalText,
      timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isProposal: true,
      proposalType: "show"
    };
    setMessages(prev => [...prev, newMessage]);
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    setCommunicationHistory(prev => [...prev, {
      timestamp,
      text: `Пётр Иванов предложил показ на ${formattedDate} в ${formattedTime}.`
    }]);
    
    dateInput.value = "";
    setSelectedBuyerForShow("");
  };

  const handleFixTerms = () => {
    setShowFixTermsDialog(true);
  };

  const confirmFixTerms = () => {
    setTermsFixed(true);
    setShowFixTermsDialog(false);
    
    // Запоминаем зафиксированного покупателя
    if (selectedBuyerForShow) {
      setFixedBuyerId(selectedBuyerForShow);
    }
    
    const now = new Date();
    const timestamp = now.toLocaleDateString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    
    const buyerName = selectedBuyerForShow ? buyers.find(b => b.id === selectedBuyerForShow)?.name || "Сергей Ким" : "Сергей Ким";
    
    setCommunicationHistory(prev => [...prev, {
      timestamp,
      text: `Условия сделки зафиксированы. Комиссия 50/50, Показ 15.01.2025 14:00, Объект: ${property.address || "ул. Невский проспект, 100"} (ID 14575419), Клиент: ${buyerName}. Инициатор: Пётр Иванов.`
    }]);
    
    // Добавляем системное сообщение в чат
    const systemMessage = {
      id: Date.now(),
      type: "system",
      content: `✅ Условия сделки зафиксированы: Комиссия 50/50, Показ 15.01.2025 в 14:00, Объект: ${property.address || "ул. Невский проспект, 100"} (ID 14575419), Клиент: ${buyerName}. Изменить можно только по взаимному согласию сторон.`,
      timestamp: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      isProposal: false,
      proposalType: undefined
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const isFixedBuyer = (buyerId: string) => {
    return termsFixed && fixedBuyerId && buyerId === fixedBuyerId;
  };

  // Формируем список чатов по умолчанию если не передан
  const chatsList = allChats.length > 0 ? allChats : [
    {
      id: "current",
      agentName: agent.name,
      agentAvatar: agent.avatar,
      propertyAddress: property.address || "Объект",
      buyerName: buyer.name,
      lastMessage: messages.length > 0 ? messages[messages.length - 1].content.substring(0, 50) : "Новый чат",
      lastMessageTime: messages.length > 0 ? messages[messages.length - 1].timestamp : "Сейчас",
      status: commissionAgreed ? "Комиссия согласована" : termsFixed ? "Условия зафиксированы" : undefined
    }
  ];

  return (
    <div className="min-h-screen bg-white flex">
      {/* Сайдбар с чатами */}
      <ChatSidebar
        chats={chatsList}
        currentChatId={currentChatId}
        onChatSelect={onChatSelect || (() => {})}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Основная область чата */}
      <div className="flex-1 flex flex-col">
        {/* Шапка чата */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center gap-4 mb-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              К совпадениям
            </Button>
            <Button 
              variant="outline"
              size="sm"
              className="ml-auto"
            >
              Открыть пару
            </Button>
          </div>

          {/* Информация о собеседнике */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
            <ImageWithFallback
              src={agent.avatar}
              alt={agent.name}
              className="w-10 h-10 object-cover rounded-full"
            />
            <div>
              <div className="text-sm text-gray-900">{agent.name}</div>
              <div className="text-xs text-gray-500">Агент</div>
            </div>
          </div>

          {/* Контекст пары */}
          <div className="flex gap-4">
            {/* Мини-карточка объекта */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 flex-1">
              <ImageWithFallback
                src={property.imageUrl}
                alt={property.address}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <div className="text-sm text-gray-900">{property.address}</div>
                <div className="text-sm text-gray-600">{property.price}</div>
              </div>
            </div>

            {/* Мини-карточка покупателя */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 flex-1">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600">{buyer.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-sm text-gray-600">{buyer.budget}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Область сообщений */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center text-gray-500 text-sm">
              Начните диалог с агентом {agent.name}
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === "outgoing" ? "justify-end" : msg.type === "system" ? "justify-center" : "justify-start"}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.type === "outgoing" 
                  ? "bg-blue-600 text-white" 
                  : msg.type === "system"
                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                  : "bg-gray-100 text-gray-900"
              }`}>
                <div className="text-sm">{msg.content}</div>
                {msg.type !== "system" && (
                  <div className={`text-xs mt-1 ${
                    msg.type === "outgoing" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {msg.timestamp}
                  </div>
                )}
                
                {/* Мелкий текст под предложениями показа */}
                {msg.isProposal && msg.type === "incoming" && msg.proposalType === "show" && (
                  <div className="text-xs text-gray-500 mt-2 italic">
                    *Если вы согласитесь, в календаре автоматически создастся задача.
                  </div>
                )}
                
                {/* Кнопки действий для входящих предложений */}
                {msg.isProposal && msg.type === "incoming" && !processedProposals.has(msg.id) && (
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs bg-white hover:bg-gray-50"
                      onClick={() => handleProposalAction(msg.id, "agree", msg.proposalType)}
                      disabled={termsFixed}
                    >
                      <Check className="w-3 h-3 mr-1" />
                      Согласиться
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 text-xs bg-white hover:bg-gray-50"
                      onClick={() => handleProposalAction(msg.id, "discuss", msg.proposalType)}
                      disabled={termsFixed}
                    >
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Обсудить
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Быстрые фразы */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {quickPhrases.map((phrase, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs bg-gray-50 border-gray-200 hover:bg-gray-100"
                onClick={() => handleQuickPhrase(phrase)}
              >
                {phrase}
              </Button>
            ))}
          </div>

          {/* Поле ввода */}
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Введите текст..."
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
            />
            <Button variant="ghost" size="sm" className="text-gray-500">
              <Smile className="w-4 h-4" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Боковая панель договоренностей */}
      <div className="w-80 border-l border-gray-200 p-4 space-y-6">
        <h3 className="text-gray-900">Договоренности</h3>

        {/* Комиссия */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Комиссия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Select value={commissionType} onValueChange={setCommissionType} disabled={termsFixed}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">%</SelectItem>
                  <SelectItem value="rub">₽</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={commissionValue}
                onChange={(e) => setCommissionValue(e.target.value)}
                placeholder="50"
                className="flex-1"
                disabled={termsFixed}
              />
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={handleCommissionProposal}
              disabled={termsFixed}
            >
              Предложить
            </Button>
            {termsFixed && (
              <div className="text-xs text-gray-500 italic">
                Условия зафиксированы
              </div>
            )}
          </CardContent>
        </Card>

        {/* Показы */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Показы</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select 
              value={selectedBuyerForShow} 
              onValueChange={setSelectedBuyerForShow}
              disabled={termsFixed && !!fixedBuyerId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите покупателя" />
              </SelectTrigger>
              <SelectContent>
                {buyers.map((buyerItem) => (
                  <SelectItem 
                    key={buyerItem.id} 
                    value={buyerItem.id}
                    disabled={isFixedBuyer(buyerItem.id)}
                  >
                    {buyerItem.name} {isFixedBuyer(buyerItem.id) ? "(зафиксирован)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="datetime-local" className="w-full" />
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full"
              onClick={handleShowProposal}
            >
              Предложить
            </Button>
            {termsFixed && fixedBuyerId && (
              <div className="text-xs text-gray-500 mt-2">
                Покупатель, по которому зафиксированы условия, недоступен для редактирования. Остальных можно добавить как дополнительные показы в сделку.
              </div>
            )}
          </CardContent>
        </Card>

        {/* История коммуникации */}
        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">История коммуникации</CardTitle>
            <p className="text-xs text-gray-500 mt-1">
              Историю видят все участники.
            </p>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto max-h-96">
            <div className="space-y-3">
              {communicationHistory.map((entry, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                  <div className="text-xs text-gray-500 mb-1">{entry.timestamp}</div>
                  <div className="text-sm text-gray-700">{entry.text}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button 
          className={`w-full ${
            termsFixed 
              ? "bg-gray-400 cursor-not-allowed" 
              : (commissionAgreed || showAgreed)
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleFixTerms}
          disabled={termsFixed || (!commissionAgreed && !showAgreed)}
          title={
            termsFixed 
              ? "Условия зафиксированы" 
              : (!commissionAgreed && !showAgreed)
              ? "Чтобы зафиксировать условия, согласуйте комиссию или дату показа."
              : "Зафиксировать условия сделки"
          }
        >
          {termsFixed ? "Условия зафиксированы" : "Зафиксировать условия"}
        </Button>

        {/* Кнопка "Создать сделку" - появляется после фиксации условий */}
        {termsFixed && (
          <Button 
            className="w-full bg-[#1976D2] hover:bg-[#1565C0] text-white mt-3"
            onClick={() => setShowCreateDealModal(true)}
          >
            Создать сделку
          </Button>
        )}

        {/* Диалог подтверждения фиксации условий */}
        <AlertDialog open={showFixTermsDialog} onOpenChange={setShowFixTermsDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Зафиксировать условия сделки?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-4">
                <p>После фиксации изменить условия можно, но потребуется повторное согласование второй стороны.</p>
                
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm mb-3">Вы фиксируете следующие условия:</p>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>Комиссия: <span className="font-medium text-gray-900">50/50</span></div>
                    <div>Показ: <span className="font-medium text-gray-900">15.01.2025, 14:00</span></div>
                    <div>Объект: <span className="font-medium text-gray-900">{property.address || "ул. Невский проспект, 100"} (ID 14575419)</span></div>
                    <div>Покупатель: <span className="font-medium text-gray-900">{selectedBuyerForShow ? buyers.find(b => b.id === selectedBuyerForShow)?.name : "Сергей Ким"}</span></div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Отмена</AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmFixTerms}
                className="bg-green-600 hover:bg-green-700"
              >
                Зафиксировать
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Модалка создания сделки */}
        <CreateDealModal
          isOpen={showCreateDealModal}
          onClose={() => setShowCreateDealModal(false)}
          onContinue={() => {
            setShowCreateDealModal(false);
            setShowDealTypeModal(true);
          }}
        />

        {/* Модалка выбора типа сделки */}
        <DealTypeSelectionModal
          isOpen={showDealTypeModal}
          onClose={() => setShowDealTypeModal(false)}
          onBack={() => {
            setShowDealTypeModal(false);
            setShowCreateDealModal(true);
          }}
          onContinue={(dealType) => {
            setShowDealTypeModal(false);
            
            // Добавляем системное сообщение о подключении представителя Хаба
            const systemMessage = {
              id: Date.now(),
              type: "system",
              content: "✅ В чат добавлен представитель Хаба «Самолет Плюс» для сопровождения сделки.",
              timestamp: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
              isProposal: false,
              proposalType: undefined
            };
            setMessages(prev => [...prev, systemMessage]);
            
            // Добавляем запись в историю коммуникаций
            const now = new Date();
            const timestamp = now.toLocaleDateString('ru-RU', { 
              day: '2-digit', 
              month: '2-digit',
              year: 'numeric'
            }) + ', ' + now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
            setCommunicationHistory(prev => [...prev, {
              timestamp,
              text: `Инициирована сделка (${dealType === "full-cycle" ? "Полный цикл" : "Регистрация / Расчёты / Титул"}). В чат добавлен представитель Хаба.`
            }]);
            
            // Здесь будет переход к следующему шагу (2/7)
          }}
        />
      </div>
    </div>
  );
}
