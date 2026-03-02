import { useState, useEffect } from "react";
import { ArrowLeft, Award, ChevronDown } from "lucide-react";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/ui/tooltip";
import { BuyerCard } from "./components/BuyerCard";
import { PropertyCard } from "./components/PropertyCard";
import { ActionPanel } from "./components/ActionPanel";
import { ConnectionLines } from "./components/ConnectionLines";
import { AgentContactModal } from "./components/AgentContactModal";
import { Chat } from "./components/Chat";
import { ChatList } from "./components/ChatList";
import { TinderSellerView } from "./components/TinderSellerView";
import { DealsTableView } from "./components/DealsTableView";
import { PropertyFoldersView } from "./components/PropertyFoldersView";
import { HiddenPairsView } from "./components/HiddenPairsView";
import { PairsTableView } from "./components/PairsTableView";
import { AgencyPairsTableView } from "./components/AgencyPairsTableView";
import { TasksView } from "./components/TasksView";
import { TasksViewV2 } from "./components/TasksViewV2";
import { TasksViewV3 } from "./components/TasksViewV3";
import { TasksViewV3_2 } from "./components/TasksViewV3_2";
import { TasksViewV3v2 } from "./components/TasksViewV3v2";
import { SuitableBuyersView } from "./components/SuitableBuyersView";
import { MatchingSuitableBuyersView } from "./components/MatchingSuitableBuyersView";
import { MainMenu } from "./components/MainMenu";
import { SellersPropertiesView } from "./components/SellersPropertiesView";
import { BuyersRequestsView } from "./components/BuyersRequestsView";
import { DefaultCommissionModal } from "./components/DefaultCommissionModal";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import { Toaster } from "./components/ui/sonner";
import olesyaAvatar from "figma:asset/35b5303f3f9bccf38a21ee64aecec4474cd6aaa0.png";

export default function App() {
  const [currentView, setCurrentView] = useState<
    | "menu"
    | "table"
    | "agency-table"
    | "matches"
    | "tasks"
    | "mls-terminal"
    | "sellers-properties"
    | "buyers-requests"
    | "suitable-buyers"
  >("menu");
  const [tasksVersion, setTasksVersion] = useState<"new" | "new2" | "old">(
    "new2",
  );
  const [oldTasksView, setOldTasksView] = useState<
    "table" | "kanban" | "stack-v2"
  >("table");
  const [matchesVersion, setMatchesVersion] = useState<"v1" | "v2">("v2");
  const [currentAgentPair, setCurrentAgentPair] = useState<string>("");
  const [currentAgencyPair, setCurrentAgencyPair] = useState<string>("");
  const [activeTab, setActiveTab] = useState("buyers");
  const [highlightedConnections, setHighlightedConnections] = useState<
    string[]
  >([]);
  const [selectedBuyers, setSelectedBuyers] = useState<string[]>([]);
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [currentProperty, setCurrentProperty] = useState<any>(null);
  const [currentBuyer, setCurrentBuyer] = useState<any>(null);
  const [buyerStatuses, setBuyerStatuses] = useState<Record<string, string>>(
    {},
  );
  const [propertyStatuses, setPropertyStatuses] = useState<
    Record<string, string>
  >({});
  const [proposedCommission, setProposedCommission] = useState<
    number | undefined
  >(undefined);
  const [proposedMessage, setProposedMessage] = useState<string | undefined>(
    undefined,
  );
  const [autoAcceptTerms, setAutoAcceptTerms] = useState(false);
  const [taskProposal, setTaskProposal] = useState<string | undefined>(
    undefined,
  );
  const [currentAgent, setCurrentAgent] = useState<any>(null);
  const [showDefaultCommissionModal, setShowDefaultCommissionModal] =
    useState(false);
  const [defaultCommission, setDefaultCommission] = useState<number | null>(
    null,
  );
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null,
  );

  // Показываем модалку каждый раз при открытии главного меню
  useEffect(() => {
    if (currentView === "menu") {
      setShowDefaultCommissionModal(true);
    }
  }, [currentView]);

  // Переключаем activeTab на sellers-tinder при переключении на v2
  useEffect(() => {
    if (matchesVersion === "v2" && activeTab === "buyers") {
      setActiveTab("sellers-tinder");
    }
  }, [matchesVersion, activeTab]);

  const handleDefaultCommissionSave = (
    commission: number | null,
    dontShowAgain: boolean,
  ) => {
    if (commission !== null) {
      setDefaultCommission(commission);
      localStorage.setItem("defaultCommission", commission.toString());
      localStorage.setItem("defaultCommissionSet", "true");
    }

    if (dontShowAgain) {
      localStorage.setItem("defaultCommissionDontShow", "true");
    }

    setShowDefaultCommissionModal(false);
  };

  // Данные покупателей
  const buyers = [
    {
      id: "buyer-1",
      name: "Сергей Ким",
      budget: "6 000 000 ₽",
      district: "Центральный",
      rooms: 2,
      status: "Актуален" as const,
      matchCount: 2,
      connectedProperties: ["property-1", "property-2"],
    },
    {
      id: "buyer-3",
      name: "Михаил Сидоров",
      budget: "8 000 000 ₽",
      district: "Центральный",
      rooms: 3,
      status: "Актуален" as const,
      connectedProperties: ["property-3"],
    },
    {
      id: "buyer-4",
      name: "Елена Волкова",
      budget: "5 200 000 ₽",
      district: "Василеостровский",
      rooms: 2,
      status: "Актуален" as const,
      connectedProperties: [],
    },
    {
      id: "buyer-5",
      name: "Дмитрий Орлов",
      budget: "7 500 000 ₽",
      district: "Центральный",
      rooms: 2,
      status: "Актуален" as const,
      matchCount: 1,
      connectedProperties: ["property-1"],
    },
    // Покупатели требующие актуализации (внизу)
    {
      id: "buyer-2",
      name: "Анна Петрова",
      budget: "4 500 000 ₽",
      district: "Приморский",
      rooms: 1,
      status: "Ак��уализировать" as const,
      connectedProperties: [],
    },
  ];

  // Разделяем покупателей на активных и требующих актуализации
  const activeBuyers = buyers.filter((buyer) => buyer.status === "Актуален");
  const outdatedBuyers = buyers.filter(
    (buyer) => buyer.status === "Актуализировать",
  );

  // Данные объектов
  const properties = [
    {
      id: "property-1",
      imageUrl:
        "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      address: "ул. Невский проспект, 100",
      price: "6 200 000 ₽",
      rooms: 2,
      status: "В работе" as const,
      district: "Центральный",
      floor: "3/9",
      area: "65 м²",
      matchCount: 2,
      connectedBuyers: ["buyer-1", "buyer-5"],
    },
    {
      id: "property-2",
      imageUrl:
        "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      address: "наб. реки Мойки, 45",
      price: "5 800 000 ₽",
      rooms: 2,
      status: "В работе" as const,
      district: "Центральный",
      floor: "2/8",
      area: "58 м²",
      connectedBuyers: ["buyer-1"],
    },
    {
      id: "property-3",
      imageUrl:
        "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      address: "ул. Рубинштейна, 23",
      price: "7 900 000 ₽",
      rooms: 3,
      status: "В работе" as const,
      district: "Центральный",
      floor: "5/12",
      area: "85 м²",
      connectedBuyers: ["buyer-3"],
    },
  ];

  // Чаты для вкладки "Пары в обсуждении"
  const chats = [
    {
      id: "chat-1",
      agent: {
        name: "Олеся Фивейская",
        avatar: olesyaAvatar,
      },
      property: {
        address: "ул. Невский проспект, 100",
        price: "6 200 000 ₽",
      },
      buyer: {
        name: "Сергей Ким",
      },
      lastMessage: "Готов назначить показ на завтра 14:00",
      lastMessageTime: "12:40",
      status: "назначен показ на 15.01",
      unreadCount: 2,
    },
    {
      id: "chat-2",
      agent: {
        name: "Олеся Фивейская",
        avatar: olesyaAvatar,
      },
      property: {
        address: "наб. реки Мойки, 45",
        price: "5 800 000 ₽",
      },
      buyer: {
        name: "Дмитрий Орлов",
      },
      lastMessage: "Обсуждаем комиссию 50/50",
      lastMessageTime: "вчера",
      status: "идёт согласование комиссии",
      unreadCount: 0,
    },
    {
      id: "chat-3",
      agent: {
        name: "Андрей Смирнов",
        avatar:
          "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      property: {
        address: "ул. Рубинштейна, 23",
        price: "7 900 000 ₽",
      },
      buyer: {
        name: "Михаил Сидоров",
      },
      lastMessage: "Клиент подтвердил интерес",
      lastMessageTime: "2 дня назад",
      status: "готовимся к показу",
      unreadCount: 0,
    },
    {
      id: "chat-4",
      agent: {
        name: "Екатерина Волкова",
        avatar:
          "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      },
      property: {
        address: "пр. Ветеранов, 78",
        price: "4 500 000 ₽",
      },
      buyer: {
        name: "Алексей Петров",
      },
      lastMessage: "Спасибо за предложение",
      lastMessageTime: "3 дня назад",
      unreadCount: 1,
    },
    {
      id: "chat-5",
      agent: {
        name: "Мария Иванова",
        avatar:
          "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      property: {
        address: "ул. Литейный пр��спект, 56",
        price: "6 500 000 ₽",
      },
      buyer: {
        name: "Георгий Белоусов",
      },
      lastMessage: "Добрый день! Буду готов обсудить условия",
      lastMessageTime: "неделю назад",
      unreadCount: 0,
    },
  ];

  // Связи для визуализации
  const connections = [
    { buyerId: "buyer-1", propertyId: "property-1" },
    { buyerId: "buyer-1", propertyId: "property-2" },
    { buyerId: "buyer-5", propertyId: "property-1" },
    { buyerId: "buyer-3", propertyId: "property-3" },
  ];

  const handleBuyerHover = (buyerId: string, isHovering: boolean) => {
    const buyer = buyers.find((b) => b.id === buyerId);
    if (buyer && isHovering) {
      setHighlightedConnections([buyerId, ...buyer.connectedProperties]);
    } else {
      setHighlightedConnections([]);
    }
  };

  const handlePropertyHover = (propertyId: string, isHovering: boolean) => {
    const property = properties.find((p) => p.id === propertyId);
    if (property && isHovering) {
      setHighlightedConnections([propertyId, ...property.connectedBuyers]);
    } else {
      setHighlightedConnections([]);
    }
  };

  const handleBuyerSelect = (buyerId: string) => {
    setSelectedBuyers((prev) =>
      prev.includes(buyerId)
        ? prev.filter((id) => id !== buyerId)
        : [...prev, buyerId],
    );
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperties((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId],
    );
  };

  const handleCall = (propertyId: string) => {
    setCurrentProperty(properties.find((p) => p.id === propertyId));
    setShowContactModal(true);
  };

  const handleMessage = (propertyId: string) => {
    const property = properties.find((p) => p.id === propertyId);
    const buyer = buyers.find((b) =>
      b.connectedProperties.includes(propertyId),
    );

    setCurrentProperty(property);
    setCurrentBuyer(buyer);
    setActiveChat("new-chat");
  };

  const handleCallComplete = (openChatAfter: boolean) => {
    if (openChatAfter) {
      handleMessage(currentProperty?.id);
    }
  };

  const handleBuyerStatusChange = (buyerId: string, status: string) => {
    setBuyerStatuses((prev) => ({ ...prev, [buyerId]: status }));
  };

  const handlePropertyStatusChange = (propertyId: string, status: string) => {
    setPropertyStatuses((prev) => ({ ...prev, [propertyId]: status }));
  };

  const handleHiddenPairRestore = (pairId: string) => {
    // Логика восстановления скрытой пары
    console.log("Восстановление пары:", pairId);
  };

  const handlePairClick = (agentName: string, targetTab?: string) => {
    setCurrentAgentPair(agentName);
    setCurrentView("matches");

    // Если указан целевой таб, устанавливаем его
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  const handleAgencyPairClick = (agencyName: string, targetTab?: string) => {
    setCurrentAgencyPair(agencyName);
    setCurrentView("matches");

    // Если указан целевой таб, устанавливаем его
    if (targetTab) {
      setActiveTab(targetTab);
    }
  };

  const handleBackToTable = () => {
    if (currentView === "matches" && currentAgencyPair) {
      setCurrentView("agency-table");
      setCurrentAgencyPair("");
    } else if (currentView === "matches" && !currentAgentPair) {
      // Если пришли из главного меню
      setCurrentView("menu");
    } else {
      setCurrentView("table");
      setCurrentAgentPair("");
    }
  };

  const handleSwitchToAgencyPairs = () => {
    setCurrentView("agency-table");
  };

  const handleSwitchToMyPairs = () => {
    setCurrentView("table");
  };

  const handleSwitchToTasks = () => {
    setCurrentView("tasks");
  };

  const handleNavigateFromMenu = (
    section: "buyers" | "sellers" | "tasks" | "pairs" | "mls-terminal",
  ) => {
    if (section === "tasks") {
      setCurrentView("tasks");
    } else if (section === "mls-terminal") {
      // Dedicated entry point into the "Новая" tasks UI
      setTasksVersion("new");
      setCurrentView("mls-terminal");
    } else if (section === "pairs") {
      setCurrentView("table");
    } else if (section === "sellers") {
      setCurrentView("sellers-properties");
    } else if (section === "buyers") {
      setCurrentView("buyers-requests");
    }
  };

  // Фильтрация видимых элементов
  const visibleBuyers = buyers.filter((buyer) => {
    const status = buyerStatuses[buyer.id];
    return !status || !["irrelevant", "closed"].includes(status);
  });
  const visibleProperties = properties.filter((property) => {
    const status = propertyStatuses[property.id];
    return !status || !["irrelevant", "closed"].includes(status);
  });

  const visibleActiveBuyers = visibleBuyers.filter(
    (buyer) => buyer.status === "Актуален",
  );
  const visibleOutdatedBuyers = visibleBuyers.filter(
    (buyer) => buyer.status === "Актуализировать",
  );

  // Данные встречного агента (Олеся)
  const partnerAgentInfo = {
    name: "Олеся Фивейская",
    agency: 'Агентство "Квартал"',
    avatar: olesyaAvatar,
    phone: "+7 (812) 987-65-43",
    telegram: "https://t.me/olesyafiv",
    whatsApp: "https://wa.me/79129876543",
  };

  // Данные текущего пользователя (Пётр)
  const myInfo = {
    name: "Пётр Иванов",
    agency: 'Агентство "ДомПрофи"',
    avatar:
      "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGF2YXRhcnxlbnwxfHx8fDE3NTk1NDc5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    phone: "+7 (812) 123-45-67",
    telegram: "https://t.me/petrivanov",
    whatsApp: "https://wa.me/79123456789",
  };

  // Если показывается главное меню
  if (currentView === "menu") {
    return (
      <>
        <MainMenu onNavigate={handleNavigateFromMenu} />

        {/* DefaultCommissionModal временно скрыта по запросу */}
      </>
    );
  }

  // Если открыт чат (проверяем первым, т.к. чат имеет приоритет)
  if (activeChat) {
    const chatType = activeChat.includes("seller") ? "seller" : "buyer";

    // Формируем список всех чатов для сайдбара
    const allChatsForSidebar = chats.map((chat) => ({
      id: chat.id,
      agentName: chat.agent.name,
      agentAvatar: chat.agent.avatar,
      propertyAddress: chat.property.address,
      buyerName: chat.buyer.name,
      lastMessage: chat.lastMessage,
      lastMessageTime: chat.lastMessageTime,
      status: chat.status,
      unreadCount: chat.unreadCount,
    }));

    return (
      <Chat
        onBack={() => {
          setActiveChat(null);
          setProposedCommission(undefined);
          setProposedMessage(undefined);
          setAutoAcceptTerms(false);
          setTaskProposal(undefined);
          setCurrentAgent(null);
        }}
        buyer={
          currentBuyer || {
            name: "Сергей Ким",
            budget: "6 000 000 ₽",
            district: "Центральный",
          }
        }
        property={currentProperty || { imageUrl: "", address: "", price: "" }}
        agent={currentAgent || partnerAgentInfo}
        myName={myInfo.name}
        chatType={chatType}
        initialCommission={proposedCommission}
        initialMessage={proposedMessage}
        autoAcceptTerms={autoAcceptTerms}
        taskProposal={taskProposal}
        currentChatId={activeChat}
        allChats={allChatsForSidebar}
        onChatSelect={(chatId) => {
          // Переключение между чатами
          setActiveChat(chatId);
          const selectedChat = chats.find((c) => c.id === chatId);
          if (selectedChat) {
            setCurrentBuyer({
              name: selectedChat.buyer.name,
              budget: "6 000 000 ₽",
              district: "Центральный",
            });
            setCurrentProperty({
              imageUrl:
                "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
              address: selectedChat.property.address,
              price: selectedChat.property.price,
            });
            // Для существующих чатов используем стандартного агента
            setCurrentAgent(null);
          }
        }}
      />
    );
  }

  // Если показывается экран объектов компании
  if (currentView === "sellers-properties") {
    return (
      <SellersPropertiesView
        onBack={() => setCurrentView("menu")}
        onBuyersClick={(propertyId) => {
          setSelectedPropertyId(propertyId);
          setCurrentView("suitable-buyers");
        }}
      />
    );
  }

  // Если показывается экран подходящих покупателей
  if (currentView === "suitable-buyers") {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Шапка */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <Button
            variant="ghost"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2"
            onClick={() => setCurrentView("sellers-properties")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к объектам
          </Button>
        </div>

        {/* Контент */}
        <SuitableBuyersView
          onStartCommunication={(commission, message) => {
            setCurrentBuyer({
              name: "Георгий Белоусов",
              budget: "6 500 000 ₽",
              district: "Центральный",
            });
            setCurrentProperty({
              imageUrl:
                "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
              address: "ул. Литейный проспект, 56",
              price: "6 500 000 ₽",
            });
            setCurrentAgent(partnerAgentInfo);
            setProposedCommission(commission);
            setProposedMessage(message);
            setActiveChat("commission-proposal-chat");
          }}
          onOpenChat={() => {
            setCurrentBuyer({
              name: "Георгий Белоусов",
              budget: "6 500 000 ₽",
              district: "Центральный",
            });
            setCurrentProperty({
              imageUrl:
                "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
              address: "ул. Литейный проспект, 56",
              price: "6 500 000 ₽",
            });
            setCurrentAgent(partnerAgentInfo);
            setProposedCommission(undefined);
            setProposedMessage(undefined);
            setActiveChat("existing-chat");
          }}
        />
      </div>
    );
  }

  // Если показывается экран заявок покупателей
  if (currentView === "buyers-requests") {
    return <BuyersRequestsView onBack={() => setCurrentView("menu")} />;
  }

  // Если показывается таблица пар агентов
  if (currentView === "table") {
    return (
      <PairsTableView
        onPairClick={handlePairClick}
        onSwitchToAgencyPairs={handleSwitchToAgencyPairs}
        onTasksClick={handleSwitchToTasks}
        tasksCount={3}
        onBackToMenu={() => setCurrentView("menu")}
      />
    );
  }

  // Если показывается таблица пар агентств
  if (currentView === "agency-table") {
    return (
      <AgencyPairsTableView
        onAgencyClick={handleAgencyPairClick}
        onSwitchToMyPairs={handleSwitchToMyPairs}
        onTasksClick={handleSwitchToTasks}
        tasksCount={3}
        onBackToMenu={() => setCurrentView("menu")}
      />
    );
  }

  // Если показывается экран задач
  const makeHandleOpenChat = () => (task: any, action?: string) => {
    // Устанавливаем данные для чата на основе системной задачи
    if (task.details.property) {
      setCurrentProperty({
        imageUrl: task.details.property.imageUrl,
        address: task.details.property.address,
        price: task.details.property.price,
      });
    }

    if (task.details.buyer) {
      setCurrentBuyer({
        name: task.details.buyer.name,
        budget: task.details.buyer.budget,
        district: "Центральный",
      });
    }

    // Устанавливаем агента встречной стороны
    if (task.agent) {
      setCurrentAgent({
        name: task.agent.name,
        agency: task.agent.company || "Агентство",
        avatar: task.agent.avatar,
        phone: "+7 (812) 123-45-67",
        telegram: "https://t.me/agent",
        whatsApp: "https://wa.me/79123456789",
      });
    } else {
      setCurrentAgent(null);
    }

    // Устанавливаем предложение из задачи, если есть
    if (task.details?.proposal) {
      setTaskProposal(task.details.proposal);
    } else {
      setTaskProposal(undefined);
    }

    // Определяем, нужно ли автоматически принять условия
    if (action === "accept-terms") {
      setAutoAcceptTerms(true);
    } else {
      setAutoAcceptTerms(false);
    }

    // Сбрасываем proposedCommission и proposedMessage для системных задач
    setProposedCommission(undefined);
    setProposedMessage(undefined);

    // Открываем чат
    setActiveChat(`system-task-${task.id}`);
  };

  if (currentView === "mls-terminal") {
    const handleOpenChat = makeHandleOpenChat();

    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2"
              onClick={() => setCurrentView("menu")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Назад
            </Button>

            <div className="text-gray-900 font-medium">МЛС Терминал</div>

            <div className="text-sm text-gray-500">Новая</div>
          </div>
        </div>

        <TasksViewV3
          onBack={() => setCurrentView("menu")}
          onOpenChat={handleOpenChat}
          hideAllTasksNavigation
          hidePotentialPairs
        />
      </div>
    );
  }

  if (currentView === "tasks") {
    const handleOpenChat = makeHandleOpenChat();

    return (
      <div className="min-h-screen bg-white flex flex-col">
        {/* Переключатель версий */}
        <div className="bg-gray-100 px-6 py-3 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Версия:</span>
              <Select
                value={tasksVersion}
                onValueChange={(value: "new" | "new2" | "old") =>
                  setTasksVersion(value)
                }
              >
                <SelectTrigger className="w-[140px] h-9 bg-white border-gray-200 hover:bg-gray-100 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">
                    <span
                      className={tasksVersion === "new" ? "font-semibold" : ""}
                    >
                      Новая
                    </span>
                  </SelectItem>
                  <SelectItem value="new2">
                    <span
                      className={tasksVersion === "new2" ? "font-semibold" : ""}
                    >
                      Новая v2
                    </span>
                  </SelectItem>
                  <SelectItem value="old">
                    <span
                      className={tasksVersion === "old" ? "font-semibold" : ""}
                    >
                      Старая
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Переключатель старых версий */}
            {tasksVersion === "old" && (
              <div className="flex gap-2">
                <button
                  onClick={() => setOldTasksView("table")}
                  className={`px-4 py-2 rounded-md text-[14px] transition-colors ${
                    oldTasksView === "table"
                      ? "bg-white text-[#318bff] shadow-sm font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Задачи (таблица)
                </button>
                <button
                  onClick={() => setOldTasksView("kanban")}
                  className={`px-4 py-2 rounded-md text-[14px] transition-colors ${
                    oldTasksView === "kanban"
                      ? "bg-white text-[#318bff] shadow-sm font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Задачи v2 (Kanban)
                </button>
                <button
                  onClick={() => setOldTasksView("stack-v2")}
                  className={`px-4 py-2 rounded-md text-[14px] transition-colors ${
                    oldTasksView === "stack-v2"
                      ? "bg-white text-[#318bff] shadow-sm font-medium"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Задачи v3 (Стакан) v2
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Отображение выбранного компонента */}
        {tasksVersion === "new" ? (
          <TasksViewV3
            onBack={() => setCurrentView("menu")}
            onOpenChat={handleOpenChat}
          />
        ) : tasksVersion === "new2" ? (
          <TasksViewV3_2
            onBack={() => setCurrentView("menu")}
            onOpenChat={handleOpenChat}
          />
        ) : (
          <>
            {oldTasksView === "table" && (
              <TasksView onBack={() => setCurrentView("menu")} />
            )}
            {oldTasksView === "kanban" && (
              <TasksViewV2 onBack={() => setCurrentView("menu")} />
            )}
            {oldTasksView === "stack-v2" && (
              <TasksViewV3v2
                onBack={() => setCurrentView("menu")}
                onOpenChat={handleOpenChat}
              />
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Навигация */}
      <div className="border-b border-gray-200 px-6 py-4">
        <Button
          variant="ghost"
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 p-2"
          onClick={handleBackToTable}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к списку пар
        </Button>
      </div>

      {/* Заголовок */}
      <div className="px-6 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-gray-900 mb-2">
                {currentAgencyPair
                  ? `Совпадения между агентством ${currentAgencyPair} и агентством Петра Иванова`
                  : currentAgentPair
                    ? `Совпадения между ${currentAgentPair} и Петром Ивановым`
                    : `Совпадения между Фивейская Олеся Олеговна и Петром Ивановым`}
              </h1>
              <p className="text-gray-600">Потенциал сделок — 12 000 000 ₽</p>
            </div>

            {/* Переключатель версий */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Версия:</span>
                    <Select
                      value={matchesVersion}
                      onValueChange={(value: "v1" | "v2") =>
                        setMatchesVersion(value)
                      }
                    >
                      <SelectTrigger className="w-[140px] h-9 bg-gray-50 border-gray-200 hover:bg-gray-100 transition-colors">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="v1">
                          <span
                            className={
                              matchesVersion === "v1" ? "font-semibold" : ""
                            }
                          >
                            v1 (Текущая)
                          </span>
                        </SelectItem>
                        <SelectItem value="v2">
                          <span
                            className={
                              matchesVersion === "v2" ? "font-semibold" : ""
                            }
                          >
                            v2 (Новая)
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Используйте для сравнения старого и нового интерфейса</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Информация об агенте */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center justify-end gap-2 mb-1">
                <span className="text-gray-900">{partnerAgentInfo.name}</span>
                <Award className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-gray-500 text-sm">
                {partnerAgentInfo.agency}
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Отвечает в течение двух часов
              </div>
            </div>
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200">
              <ImageWithFallback
                src={partnerAgentInfo.avatar}
                alt={partnerAgentInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Табы - версия v1 */}
      {matchesVersion === "v1" && (
        <div className="px-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-fit grid-cols-6 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="buyers"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Мои покупатели
              </TabsTrigger>
              <TabsTrigger
                value="sellers-tinder"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Продавцы (Tinder)
              </TabsTrigger>
              <TabsTrigger
                value="sellers-table"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Потенциал сделок
              </TabsTrigger>
              <TabsTrigger
                value="sellers-folders"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                По объектам
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Пары в обсуждении
              </TabsTrigger>
              <TabsTrigger
                value="hidden"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Скрытые пары
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buyers" className="mt-6">
              <div className="flex gap-6">
                {/* Основное содержимое */}
                <div className="flex-1 relative">
                  <ConnectionLines
                    connections={connections}
                    highlightedConnections={highlightedConnections}
                  />
                  <div className="flex gap-12">
                    {/* Колонка покупателей */}
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-4">Мои покупатели</h3>
                      <div className="space-y-4">
                        {/* Активные покупатели */}
                        {visibleActiveBuyers.map((buyer) => (
                          <div key={buyer.id} data-buyer-id={buyer.id}>
                            <BuyerCard
                              {...buyer}
                              isHighlighted={highlightedConnections.includes(
                                buyer.id,
                              )}
                              isSelected={selectedBuyers.includes(buyer.id)}
                              isDimmed={
                                highlightedConnections.length > 0 &&
                                !highlightedConnections.includes(buyer.id)
                              }
                              interactionStatus={buyerStatuses[buyer.id] || ""}
                              onHover={(isHovering) =>
                                handleBuyerHover(buyer.id, isHovering)
                              }
                              onSelect={() => handleBuyerSelect(buyer.id)}
                              onInteractionStatusChange={(status) =>
                                handleBuyerStatusChange(buyer.id, status)
                              }
                            />
                          </div>
                        ))}

                        {/* Разделитель */}
                        {visibleOutdatedBuyers.length > 0 && (
                          <div className="flex items-center gap-4 py-4">
                            <div className="flex-1 h-px bg-gray-200"></div>
                            <span className="text-sm text-gray-500">
                              — Нужна актуализация (
                              {visibleOutdatedBuyers.length}) —
                            </span>
                            <div className="flex-1 h-px bg-gray-200"></div>
                          </div>
                        )}

                        {/* Покупатели требующие актуализации */}
                        {visibleOutdatedBuyers.map((buyer) => (
                          <div key={buyer.id} data-buyer-id={buyer.id}>
                            <BuyerCard
                              {...buyer}
                              isHighlighted={highlightedConnections.includes(
                                buyer.id,
                              )}
                              isSelected={selectedBuyers.includes(buyer.id)}
                              isDimmed={
                                highlightedConnections.length > 0 &&
                                !highlightedConnections.includes(buyer.id)
                              }
                              interactionStatus={buyerStatuses[buyer.id] || ""}
                              onHover={(isHovering) =>
                                handleBuyerHover(buyer.id, isHovering)
                              }
                              onSelect={() => handleBuyerSelect(buyer.id)}
                              onInteractionStatusChange={(status) =>
                                handleBuyerStatusChange(buyer.id, status)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Коридор для стрелок */}
                    <div className="w-12 flex-shrink-0"></div>

                    {/* Колонка объектов */}
                    <div className="flex-1">
                      <h3 className="text-gray-900 mb-4">
                        Объекты агента Олеси
                      </h3>
                      <div className="space-y-6">
                        {visibleProperties.map((property) => (
                          <div key={property.id} data-property-id={property.id}>
                            <PropertyCard
                              {...property}
                              isHighlighted={highlightedConnections.includes(
                                property.id,
                              )}
                              isSelected={selectedProperties.includes(
                                property.id,
                              )}
                              isDimmed={
                                highlightedConnections.length > 0 &&
                                !highlightedConnections.includes(property.id)
                              }
                              interactionStatus={
                                propertyStatuses[property.id] || ""
                              }
                              onHover={(isHovering) =>
                                handlePropertyHover(property.id, isHovering)
                              }
                              onCall={() => handleCall(property.id)}
                              onMessage={() => handleMessage(property.id)}
                              onScheduleShow={() => {
                                /* TODO: обработчик показа */
                              }}
                              onInteractionStatusChange={(status) =>
                                handlePropertyStatusChange(property.id, status)
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Правая панель */}
                <ActionPanel />
              </div>
            </TabsContent>

            <TabsContent value="sellers-tinder" className="mt-6">
              <TinderSellerView
                onMessage={(buyerId) => {
                  if (buyerId === "auto-message") {
                    // Автоматическое сообщение при лайке
                    setCurrentBuyer({
                      name: "Георгий Белоусов",
                      budget: "6 000 000 ₽",
                      district: "Центральный",
                    });
                    setActiveChat("seller-chat");
                  } else {
                    const buyer = buyers.find((b) => b.id === buyerId);
                    setCurrentBuyer(buyer);
                    setActiveChat("seller-chat");
                  }
                }}
                onCall={(buyerId) => {
                  const buyer = buyers.find((b) => b.id === buyerId);
                  setCurrentBuyer(buyer);
                  setShowContactModal(true);
                }}
                onLike={(propertyId) => {
                  console.log("Лайк объекта:", propertyId);
                }}
                onDislike={(propertyId) => {
                  console.log(
                    "Дизлайк объекта - перемещен в скрытые пары:",
                    propertyId,
                  );
                }}
              />
            </TabsContent>

            <TabsContent value="sellers-table" className="mt-6">
              <DealsTableView
                onMessage={(dealId) => {
                  setActiveChat("deal-chat");
                }}
                onCall={(dealId) => {
                  setShowContactModal(true);
                }}
                onStatusChange={(dealId, status) => {
                  console.log("Deal status changed:", dealId, status);
                }}
              />
            </TabsContent>

            <TabsContent value="sellers-folders" className="mt-6">
              <PropertyFoldersView
                onMessage={(buyerId) => {
                  const buyer = buyers.find((b) => b.id === buyerId);
                  setCurrentBuyer(buyer);
                  setActiveChat("folder-chat");
                }}
                onCall={(buyerId) => {
                  setShowContactModal(true);
                }}
                onScheduleShow={(buyerId) => {
                  console.log("Schedule show for buyer:", buyerId);
                }}
                onStatusChange={(buyerId, status) => {
                  handleBuyerStatusChange(buyerId, status);
                }}
              />
            </TabsContent>

            <TabsContent value="in-progress" className="mt-6">
              <div className="max-w-4xl">
                <h3 className="text-gray-900 mb-4">Активные обсуждения</h3>
                <ChatList
                  chats={chats}
                  onChatSelect={(chatId) => setActiveChat(chatId)}
                />
              </div>
            </TabsContent>

            <TabsContent value="hidden" className="mt-6">
              <HiddenPairsView onRestore={handleHiddenPairRestore} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Табы - версия v2 */}
      {matchesVersion === "v2" && (
        <div className="px-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-fit grid-cols-4 bg-gray-100 p-1 rounded-lg">
              <TabsTrigger
                value="sellers-tinder"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Подходящие продавцы
              </TabsTrigger>
              <TabsTrigger
                value="suitable-buyers"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Подходящие покупатели
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Пары в обсуждении
              </TabsTrigger>
              <TabsTrigger
                value="hidden"
                className="data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm text-sm"
              >
                Скрытые пары
              </TabsTrigger>
            </TabsList>

            <TabsContent value="sellers-tinder" className="mt-6">
              <TinderSellerView
                onMessage={(buyerId) => {
                  if (buyerId === "auto-message") {
                    // Автоматическое сообщение при лайке
                    setCurrentBuyer({
                      name: "Георгий Белоусов",
                      budget: "6 000 000 ₽",
                      district: "Центральный",
                    });
                    setActiveChat("seller-chat");
                  } else {
                    const buyer = buyers.find((b) => b.id === buyerId);
                    setCurrentBuyer(buyer);
                    setActiveChat("seller-chat");
                  }
                }}
                onCall={(buyerId) => {
                  const buyer = buyers.find((b) => b.id === buyerId);
                  setCurrentBuyer(buyer);
                  setShowContactModal(true);
                }}
                onLike={(propertyId) => {
                  console.log("Лайк объекта:", propertyId);
                }}
                onDislike={(propertyId) => {
                  console.log(
                    "Дизлайк объекта - перемещен в скрытые пары:",
                    propertyId,
                  );
                }}
                onStartCommunication={(propertyId, commission, message) => {
                  setCurrentBuyer({
                    name: "Сергей Ким",
                    budget: "6 000 000 ₽",
                    district: "Центральный",
                  });
                  setCurrentProperty({
                    imageUrl:
                      "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    address: "ул. Невский проспект, 100",
                    price: "6 200 000 ₽",
                  });
                  setProposedCommission(commission);
                  setProposedMessage(message);
                  setActiveChat(`seller-property-chat-${propertyId}`);
                }}
                onHidePair={() => {
                  // Пара скрыта, следующая пара откроется автоматически
                }}
              />
            </TabsContent>

            <TabsContent value="suitable-buyers" className="mt-6">
              <MatchingSuitableBuyersView
                myProperty={{
                  id: "my-property-1",
                  imageUrl:
                    "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
                  address: "ул. Литейный проспект, 56",
                  price: "6 500 000 ₽",
                  rooms: 2,
                  district: "Центральный",
                  floor: "5/12",
                  area: "65 м²",
                }}
                partnerBuyers={[
                  {
                    id: "partner-buyer-1",
                    name: "Георгий Белоусов",
                    budget: "6 500 000 ₽",
                    district: "Центральный",
                    rooms: 2,
                    status: "В работе",
                    hasActiveChat: false,
                  },
                  {
                    id: "partner-buyer-2",
                    name: "Мария Соколова",
                    budget: "6 000 000 ₽",
                    district: "Центральный",
                    rooms: 2,
                    status: "В работе",
                    hasActiveChat: false,
                  },
                  {
                    id: "partner-buyer-3",
                    name: "Иван Кузнецов",
                    budget: "7 000 000 ₽",
                    district: "Центральный, Адмиралтейский",
                    rooms: 2,
                    status: "В работе",
                    hasActiveChat: true,
                  },
                ]}
                onStartCommunication={(buyerId, commission, message) => {
                  const buyer = [
                    {
                      id: "partner-buyer-1",
                      name: "Георгий Белоусов",
                      budget: "6 500 000 ₽",
                    },
                    {
                      id: "partner-buyer-2",
                      name: "Мария Соколова",
                      budget: "6 000 000 ₽",
                    },
                    {
                      id: "partner-buyer-3",
                      name: "Иван Кузнецов",
                      budget: "7 000 000 ₽",
                    },
                  ].find((b) => b.id === buyerId);

                  setCurrentBuyer({
                    name: buyer?.name || "Покупатель",
                    budget: buyer?.budget || "6 500 000 ₽",
                    district: "Центральный",
                  });
                  setCurrentProperty({
                    imageUrl:
                      "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    address: "ул. Литейный проспект, 56",
                    price: "6 500 000 ₽",
                  });
                  setProposedCommission(commission);
                  setProposedMessage(message);
                  setActiveChat(`suitable-buyer-chat-${buyerId}`);
                }}
                onOpenChat={(buyerId) => {
                  const buyer = [
                    {
                      id: "partner-buyer-1",
                      name: "Георгий Белоусов",
                      budget: "6 500 000 ₽",
                    },
                    {
                      id: "partner-buyer-2",
                      name: "Мария Соколова",
                      budget: "6 000 000 ₽",
                    },
                    {
                      id: "partner-buyer-3",
                      name: "Иван Кузнецов",
                      budget: "7 000 000 ₽",
                    },
                  ].find((b) => b.id === buyerId);

                  setCurrentBuyer({
                    name: buyer?.name || "Покупатель",
                    budget: buyer?.budget || "6 500 000 ₽",
                    district: "Центральный",
                  });
                  setCurrentProperty({
                    imageUrl:
                      "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
                    address: "ул. Литейный проспект, 56",
                    price: "6 500 000 ₽",
                  });
                  setProposedCommission(undefined);
                  setProposedMessage(undefined);
                  setActiveChat(`existing-suitable-buyer-chat-${buyerId}`);
                }}
                onHidePair={() => {
                  // Пара скрыта, следующая пара откроется автоматически
                }}
              />
            </TabsContent>

            <TabsContent value="in-progress" className="mt-6">
              <div className="max-w-4xl">
                <h3 className="text-gray-900 mb-4">Активные обсуждения</h3>
                <ChatList
                  chats={chats}
                  onChatSelect={(chatId) => setActiveChat(chatId)}
                />
              </div>
            </TabsContent>

            <TabsContent value="hidden" className="mt-6">
              <HiddenPairsView onRestore={handleHiddenPairRestore} />
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Модалка контактов агента */}
      <AgentContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        agentName={partnerAgentInfo.name}
        agentAgency={partnerAgentInfo.agency}
        agentAvatar={partnerAgentInfo.avatar}
        agentPhone={partnerAgentInfo.phone}
        agentTelegram={partnerAgentInfo.telegram}
        agentWhatsApp={partnerAgentInfo.whatsApp}
        onCall={handleCallComplete}
      />

      {/* Toaster для уведомлений */}
      <Toaster />
    </div>
  );
}
