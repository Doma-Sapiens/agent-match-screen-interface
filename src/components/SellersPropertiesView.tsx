import { useState } from "react";
import { ArrowLeft, Search, Filter, Plus, MapPin, MessageCircle, MoreVertical, SlidersHorizontal, Calculator } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import svgPaths from "../imports/svg-mic4nfy4kl";

interface SellersPropertiesViewProps {
  onBack?: () => void;
  onBuyersClick?: (propertyId: string) => void;
  onOpenCommissionChat?: (payload: {
    chatId: string;
    clientName: string;
    propertyAddress: string;
    propertyPrice: string;
    propertyImage: string;
    agentName: string;
    agentCompany: string;
  }) => void;
  preselectedClientId?: string | null;
}

interface Property {
  id: string;
  responsible: string;
  createdBy: string;
  photo: string;
  contactName: string;
  contactPhone: string;
  advertisingStatus: string;
  propertyType: string;
  propertySubtype: string;
  location: string;
  house: string;
  metro: string;
  createdDate: string;
  modifiedDate: string;
  leadStatus: string;
  leadTime: string;
  buyersCount: number;
  price: string;
  pricePerMeter: string;
  floor: string;
  area: string;
  myCommissionReady: "Да" | "Нет";
  myCommissionValue: string;
  myCommissionType: "% от суммы сделки" | "% от моей комиссии" | "Фикс";
  partnerCommissionReady?: "Да" | "Нет";
  partnerCommissionValue?: string;
  partnerCommissionType?: "% от суммы сделки" | "% от моей комиссии" | "Фикс";
  partnerAgentName: string;
  partnerAgentCompany: string;
}

interface MyClient {
  id: string;
  name: string;
}

interface CommissionProposal {
  id: string;
  pairKey: string;
  propertyId: string;
  clientId: string;
  clientName: string;
  commissionType: "% от суммы сделки" | "% от моей комиссии" | "Фикс";
  commissionValue: string;
  message?: string;
  status: "Ожидает ответа" | "Закрыто новым предложением";
  createdAt: string;
}

interface Discussion {
  pairKey: string;
  propertyId: string;
  clientId: string;
  clientName: string;
  chatId: string;
  status: "active" | "closed";
}

interface ProposalModalState {
  propertyId: string;
  clientId: string;
  clientName: string;
  commissionType: "% от суммы сделки" | "% от моей комиссии" | "Фикс";
  commissionValue: string;
  message: string;
}

interface ClientSelectionState {
  propertyId: string;
  selectedClientId: string;
}

interface ExistingDiscussionState {
  propertyId: string;
  clientId: string;
  clientName: string;
  chatId: string;
}

// Компонент иконки стрелки из Figma
function SortArrow() {
  return (
    <div className="relative shrink-0 size-[12px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g>
          <path d={svgPaths.pc8da800} fill="#6C6C6C" />
        </g>
      </svg>
    </div>
  );
}

// Компонент иконки редактирования
function EditIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g clipPath="url(#clip0_66_2286)">
          <path d={svgPaths.p2a438cf0} fill="white" />
        </g>
        <defs>
          <clipPath id="clip0_66_2286">
            <rect fill="white" height="20" width="20" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

// Компонент иконки метро
function MetroIcon() {
  return (
    <div className="relative shrink-0 size-[20px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g>
          <path d={svgPaths.p3adcbf80} fill="#318BFF" />
        </g>
      </svg>
    </div>
  );
}

export function SellersPropertiesView({
  onBack,
  onBuyersClick,
  onOpenCommissionChat,
  preselectedClientId,
}: SellersPropertiesViewProps) {
  const [activeTab, setActiveTab] = useState("company");
  const [activeFilter, setActiveFilter] = useState("leads24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<string[]>([]);
  const [presentationMode, setPresentationMode] = useState(false);
  const [clientSelectionState, setClientSelectionState] = useState<ClientSelectionState | null>(
    null,
  );
  const [proposalModalState, setProposalModalState] = useState<ProposalModalState | null>(null);
  const [existingDiscussionState, setExistingDiscussionState] =
    useState<ExistingDiscussionState | null>(null);
  const [proposals, setProposals] = useState<CommissionProposal[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);

  const myClients: MyClient[] = [
    { id: "client-1", name: "Сергей Ким" },
    { id: "client-2", name: "Дмитрий Орлов" },
    { id: "client-3", name: "Елена Волкова" },
  ];

  // Моковые данные объектов
  const properties: Property[] = [
    {
      id: "119673935",
      responsible: "Милкин Илья",
      createdBy: "Милкин Илья",
      photo: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      contactName: "Георгий Белоусов",
      contactPhone: "+7 911 545 69 87",
      advertisingStatus: "Итого: 60 дн. | 5 000 р. | 150 просм-в",
      propertyType: "Квартира",
      propertySubtype: "2 комн. Стандартная",
      location: "г. Санкт-Петербург, Адмиралтейский р-н, Наб.Обводного канала д. 154",
      house: "д. 150, корп: 1, лит: А, стр: 2",
      metro: "Адмиралтейская",
      createdDate: "20.03.24 в 12:45",
      modifiedDate: "20.03.24 в 12:45",
      leadStatus: "СБОР ДАННЫХ",
      leadTime: "16 часов",
      buyersCount: 3,
      price: "125 000 000 ₽",
      pricePerMeter: "100 000 ₽/ м²",
      floor: "2 / 15",
      area: "общая: 65 м², жилая: 45 м², кухня: 17 м²",
      myCommissionReady: "Да",
      myCommissionValue: "2.5",
      myCommissionType: "% от суммы сделки",
      partnerCommissionReady: "Да",
      partnerCommissionValue: "50",
      partnerCommissionType: "% от моей комиссии",
      partnerAgentName: "Олеся Фивейская",
      partnerAgentCompany: "Агентство Квартал",
    },
    {
      id: "119673936",
      responsible: "Милкин Илья",
      createdBy: "Милкин Илья",
      photo: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
      contactName: "Георгий Белоусов",
      contactPhone: "+7 911 545 69 87",
      advertisingStatus: "Итого: 60 дн. | 5 000 р. | 150 просм-в",
      propertyType: "Квартира",
      propertySubtype: "2 комн. Стандартная",
      location: "г. Санкт-Петербург, Адмиралтейский р-н, Наб.Обводного канала д. 154",
      house: "д. 150, корп: 1, лит: А, стр: 2",
      metro: "Садовая",
      createdDate: "20.03.24 в 12:45",
      modifiedDate: "20.03.24 в 12:45",
      leadStatus: "СБОР ДАННЫХ",
      leadTime: "16 часов",
      buyersCount: 3,
      price: "125 000 000 ₽",
      pricePerMeter: "100 000 ₽/ м²",
      floor: "2 / 15",
      area: "общая: 65 м², жилая: 45 м², кухня: 17 м²",
      myCommissionReady: "Да",
      myCommissionValue: "3",
      myCommissionType: "% от суммы сделки",
      partnerCommissionReady: "Нет",
      partnerAgentName: "Андрей Смирнов",
      partnerAgentCompany: "Элит Недвижимость",
    }
  ];

  const filterCounts = {
    overdue: 2425,
    all: 4824,
    callCenter: 0,
    leads24h: 2422,
    readyForDeposit: 2,
    agreement10d: 4,
    depositMade: 3
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProperties(properties.map(p => p.id));
    } else {
      setSelectedProperties([]);
    }
  };

  const handleSelectProperty = (propertyId: string, checked: boolean) => {
    if (checked) {
      setSelectedProperties([...selectedProperties, propertyId]);
    } else {
      setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
    }
  };

  const getPropertyById = (propertyId: string) =>
    properties.find((property) => property.id === propertyId);

  const getClientById = (clientId: string) =>
    myClients.find((client) => client.id === clientId);

  const getPairKey = (propertyId: string, clientId: string) => `${propertyId}:${clientId}`;

  const openProposalModal = (propertyId: string, clientId: string, clientName: string) => {
    setProposalModalState({
      propertyId,
      clientId,
      clientName,
      commissionType: "% от суммы сделки",
      commissionValue: "",
      message: "",
    });
  };

  const continueWithClientContext = (propertyId: string, clientId: string) => {
    const client = getClientById(clientId);
    if (!client) return;
    const pairKey = getPairKey(propertyId, clientId);
    const existing = discussions.find(
      (discussion) => discussion.pairKey === pairKey && discussion.status === "active",
    );

    if (existing) {
      setExistingDiscussionState({
        propertyId,
        clientId,
        clientName: existing.clientName,
        chatId: existing.chatId,
      });
      return;
    }

    openProposalModal(propertyId, clientId, client.name);
  };

  const handleStartProposal = (propertyId: string) => {
    if (preselectedClientId) {
      continueWithClientContext(propertyId, preselectedClientId);
      return;
    }

    setClientSelectionState({
      propertyId,
      selectedClientId: "",
    });
  };

  const handleConfirmClientSelection = () => {
    if (!clientSelectionState?.selectedClientId) return;
    const { propertyId, selectedClientId } = clientSelectionState;
    setClientSelectionState(null);
    continueWithClientContext(propertyId, selectedClientId);
  };

  const handleOpenExistingChat = (chatId: string, propertyId: string, clientName: string) => {
    const property = getPropertyById(propertyId);
    if (!property || !onOpenCommissionChat) return;

    onOpenCommissionChat({
      chatId,
      clientName,
      propertyAddress: property.location,
      propertyPrice: property.price,
      propertyImage: property.photo,
      agentName: property.partnerAgentName,
      agentCompany: property.partnerAgentCompany,
    });
    setExistingDiscussionState(null);
  };

  const handleSubmitProposal = () => {
    if (!proposalModalState) return;
    const property = getPropertyById(proposalModalState.propertyId);
    if (!property || !proposalModalState.commissionValue.trim()) return;

    const pairKey = getPairKey(proposalModalState.propertyId, proposalModalState.clientId);
    const createdAt = new Date().toLocaleString("ru-RU");
    const chatId = `seller-commission-${pairKey}`;

    setProposals((prev) => {
      const closedPrevious = prev.map((proposal) =>
        proposal.pairKey === pairKey && proposal.status === "Ожидает ответа"
          ? { ...proposal, status: "Закрыто новым предложением" as const }
          : proposal,
      );

      return [
        ...closedPrevious,
        {
          id: `proposal-${Date.now()}`,
          pairKey,
          propertyId: proposalModalState.propertyId,
          clientId: proposalModalState.clientId,
          clientName: proposalModalState.clientName,
          commissionType: proposalModalState.commissionType,
          commissionValue: proposalModalState.commissionValue.trim(),
          message: proposalModalState.message.trim() || undefined,
          status: "Ожидает ответа",
          createdAt,
        },
      ];
    });

    setDiscussions((prev) => {
      const next = prev.map((discussion) =>
        discussion.pairKey === pairKey ? { ...discussion, status: "closed" as const } : discussion,
      );

      const activeDiscussion = next.find(
        (discussion) => discussion.pairKey === pairKey && discussion.status === "active",
      );
      if (activeDiscussion) return next;

      return [
        ...next,
        {
          pairKey,
          propertyId: proposalModalState.propertyId,
          clientId: proposalModalState.clientId,
          clientName: proposalModalState.clientName,
          chatId,
          status: "active",
        },
      ];
    });

    setProposalModalState(null);
  };

  const hasActiveProposal = (propertyId: string) =>
    proposals.some(
      (proposal) => proposal.propertyId === propertyId && proposal.status === "Ожидает ответа",
    );

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#318bff]" />
            </button>
            <div>
              <h1 className="text-[#0d0d0d]">
                Продавцы, Объекты компании – {filterCounts.all}
              </h1>
              <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Управление объектами недвижимости
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Поиск */}
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по объектам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            {/* Создать объект */}
            <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white gap-2">
              <Plus className="w-4 h-4" />
              Создать объект
            </Button>

            {/* Фильтр */}
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Фильтр
            </Button>

            {/* Режим презентации */}
            <div className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white">
              <span className="text-[13px] text-gray-700">Режим презентации</span>
              <Switch
                checked={presentationMode}
                onCheckedChange={setPresentationMode}
              />
            </div>

            {/* Калькулятор пакета */}
            <Button variant="outline" className="gap-2 whitespace-nowrap">
              <Calculator className="w-4 h-4" />
              Калькулятор пакета (регионы)
            </Button>
          </div>
        </div>

        {/* Вкладки */}
        <div className="px-6 border-t border-gray-200">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-b-0 h-12 p-0">
              <TabsTrigger
                value="my"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF] rounded-none px-6 h-12"
              >
                Мои объекты
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF] rounded-none px-6 h-12"
              >
                Объекты компании
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Фильтры по статусу */}
        <div className="px-6 py-3 flex items-center gap-2 border-t border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveFilter("overdue")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "overdue"
                ? "bg-red-100 text-red-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Просроченные ({filterCounts.overdue})
          </button>
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "all"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Все ({filterCounts.all})
          </button>
          <button
            onClick={() => setActiveFilter("callCenter")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "callCenter"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Контакт-центр ({filterCounts.callCenter})
          </button>
          <button
            onClick={() => setActiveFilter("leads24h")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "leads24h"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Лиды (24 ч.) ({filterCounts.leads24h})
          </button>
          <button
            onClick={() => setActiveFilter("readyForDeposit")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "readyForDeposit"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Готовы к задатку/сделке ({filterCounts.readyForDeposit})
          </button>
          <button
            onClick={() => setActiveFilter("agreement10d")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "agreement10d"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Создана договорённость (10 дн.) ({filterCounts.agreement10d})
          </button>
          <button
            onClick={() => setActiveFilter("depositMade")}
            className={`px-4 py-2 rounded-full text-[13px] whitespace-nowrap transition-colors ${
              activeFilter === "depositMade"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            style={{ fontVariationSettings: "'wdth' 100" }}
          >
            Задаток проведен ({filterCounts.depositMade})
          </button>
        </div>
      </div>

      {/* Таблица */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {properties.map((property, index) => (
            <div 
              key={property.id}
              className="relative mb-4 bg-white rounded-lg border border-[#e5effc] shadow-[0px_4px_15px_0px_rgba(28,105,255,0.06)] overflow-hidden"
            >
              {/* Строка таблицы */}
              <div className="flex items-start relative">
                {/* Чекбокс */}
                <div className="bg-white flex flex-col items-center p-[10px] w-[36px] border-r border-[#f3f3f3] shadow-[2px_0px_6px_0px_rgba(0,0,0,0.04)]">
                  <Checkbox
                    checked={selectedProperties.includes(property.id)}
                    onCheckedChange={(checked) => handleSelectProperty(property.id, checked as boolean)}
                  />
                  <p className="text-[#848484] text-[14px] text-center mt-2" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {index + 1}
                  </p>
                </div>

                {/* Фото */}
                <div className="bg-white flex flex-col gap-[10px] p-[10px] w-[152px] border-r border-[#f3f3f3]">
                  <div className="relative bg-[#f3f3f3] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.06)] h-[96px] w-[132px] overflow-hidden">
                    <img 
                      src={property.photo} 
                      alt="Объект"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute right-0 top-0 bg-[rgba(13,13,13,0.5)] p-[2px] rounded-bl-[4px] rounded-tr-[4px] w-[24px]">
                      <EditIcon />
                    </div>
                  </div>
                </div>

                {/* Ответственный */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[180px] border-r border-[#f3f3f3]">
                  <p className="text-[#318bff] text-[14px]">{property.responsible}</p>
                  <p className="text-[#848484] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Агент 007
                  </p>
                  <p className="text-[#3b3b3b] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Название компании
                  </p>
                  <button
                    onClick={() => handleStartProposal(property.id)}
                    className="bg-white border border-[#318bff] rounded-[7px] px-[10px] py-[4px] flex items-center gap-[6px] w-fit hover:bg-[#ecf7ff] transition-colors"
                  >
                    <MessageCircle className="w-[16px] h-[16px] text-[#318bff]" />
                    <span className="text-[#318bff] text-[13px]">Предложить деление комиссии</span>
                  </button>
                </div>

                {/* Реклама */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] min-w-[274px] border-r border-[#f3f3f3]">
                  <p className="text-[#318bff] text-[14px]">Обращений - 12</p>
                  <div className="flex flex-col gap-[10px] text-[#0d0d0d] text-[14px]">
                    <p>
                      <span>Итого: </span>
                      <span className="text-[#3b3b3b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        60 дн. | 5 000 р. | 150 просм-в
                      </span>
                    </p>
                    <p>
                      <span>Авито: </span>
                      <span className="text-[#3b3b3b]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        60 дн. | 5 000 р. | 150 просм-в
                      </span>
                    </p>
                  </div>
                </div>

                {/* Контакты */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[200px] border-r border-[#f3f3f3]">
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#ffcb00] rounded-full size-[8px]"></div>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-[#318bff] text-[14px]">{property.contactName}</p>
                      <SortArrow />
                    </div>
                  </div>
                  <p className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.contactPhone}
                  </p>
                  <button className="bg-white border border-[#318bff] rounded-[7px] px-[10px] py-[6px] text-[#318bff] text-[13px] w-fit">
                    Написать сообщение
                  </button>
                </div>

                {/* Тип объекта */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[160px] border-r border-[#f3f3f3]">
                  <p className="text-[#0d0d0d] text-[14px]">{property.propertyType}</p>
                  <p className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.propertySubtype.split(' ')[0]}
                  </p>
                  <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.propertySubtype.split(' ').slice(1).join(' ')}
                  </p>
                  <p className="text-[#318bff] text-[14px]">Пересечений нет</p>
                </div>

                {/* Расположение */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[300px] border-r border-[#f3f3f3]">
                  <div className="flex gap-[10px] items-start">
                    <MapPin className="w-[20px] h-[20px] text-[#318bff] flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-[10px]">
                      <p className="text-[#318bff] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {property.location}
                      </p>
                      <div className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        <p className="mb-0">Белоостровское шоссе</p>
                        <p>От КАД 15 км</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Дом */}
                <div className="bg-white flex flex-col gap-[6px] p-[16px] w-[100px] border-r border-[#f3f3f3]">
                  <p className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <span className="text-[#848484]">дом: </span>150
                  </p>
                  <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    корп:<span className="text-[#0d0d0d]"> 1</span>
                  </p>
                  <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    лит: <span className="text-[#0d0d0d]">А</span>
                  </p>
                  <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    стр: <span className="text-[#0d0d0d]">2</span>
                  </p>
                </div>

                {/* Метро */}
                <div className="bg-white flex flex-col gap-[6px] p-[16px] w-[180px] border-r border-[#f3f3f3]">
                  <div className="flex gap-[5px] items-center">
                    <MetroIcon />
                    <p className="text-[#0d0d0d] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap w-[120px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {property.metro}
                    </p>
                  </div>
                </div>

                {/* Цена */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[140px] border-r border-[#f3f3f3]">
                  <p className="text-[#0d0d0d] text-[16px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.price}
                  </p>
                  <p className="text-[#0d0d0d] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.pricePerMeter}
                  </p>
                  <p className="text-[#848484] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Торг, ипотека
                  </p>
                </div>

                {/* Этаж */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[156px] border-r border-[#f3f3f3]">
                  <p className="text-[#0d0d0d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.floor}
                  </p>
                  <p className="text-[#0d0d0d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    2 лифта
                  </p>
                  <p className="text-[#0d0d0d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <span className="text-[#848484]">Мусоропровод: </span>—
                  </p>
                </div>

                {/* Площади */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[160px]">
                  <p className="text-[#848484] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.area.split(',')[0]}
                  </p>
                  <p className="text-[#848484] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.area.split(',')[1]}
                  </p>
                  <p className="text-[#848484] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {property.area.split(',')[2]}
                  </p>
                </div>
              </div>

              {/* Детали объекта */}
              <div className="bg-white border-t border-[#f3f3f3] px-[10px] py-[6px] flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  {/* ID объекта */}
                  <div className="bg-[#ecf7ff] border border-[#e5effc] rounded-[5px] px-[10px] py-[2px] flex items-center gap-[6px]">
                    <p className="text-[#318bff] text-[13px]">id-{property.id}</p>
                  </div>

                  {/* Статус */}
                  {activeFilter === "leads24h" && (
                    <div className="bg-[#ebf8ee] border border-[#e5effc] rounded-[5px] px-[10px] py-[7px]">
                      <p className="text-[#008937] text-[14px]">Аванс/Задаток: дата сделки 18.05.24</p>
                    </div>
                  )}
                  {hasActiveProposal(property.id) && (
                    <div className="bg-[#ecf7ff] border border-[#e5effc] rounded-[5px] px-[10px] py-[7px]">
                      <p className="text-[#318bff] text-[13px]">Активное предложение: Ожидает ответа</p>
                    </div>
                  )}

                  {/* Дата создания */}
                  <div className="bg-[#f3f3f3] rounded-[5px] px-[10px] py-[2px] flex items-center gap-[4px]">
                    <p className="text-[#848484] text-[13px] w-[136px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <span className="text-[#0d0d0d]">Созд:</span> {property.createdDate}
                    </p>
                    <SortArrow />
                  </div>

                  {/* Дата изменения */}
                  <div className="bg-[#f3f3f3] rounded-[5px] px-[10px] py-[2px] flex items-center gap-[4px]">
                    <p className="text-[#848484] text-[13px] w-[132px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <span className="text-[#3b3b3b]">Изм:</span> {property.modifiedDate}
                    </p>
                    <SortArrow />
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center gap-[10px]">
                  <button 
                    onClick={() => onBuyersClick?.(property.id)}
                    className="bg-[#ebf8f5] border border-[#e5effc] rounded-[8px] px-[16px] py-[10px] text-[#05a87c] text-[14px] hover:bg-[#d5f2eb] transition-colors" 
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Покупателей - {property.buyersCount}
                  </button>
                  <button className="bg-[#ecf7ff] border border-[#e5effc] rounded-[8px] px-[20px] py-[10px] w-[60px] h-[32px] flex items-center justify-center relative">
                    <MoreVertical className="w-[20px] h-[20px] text-[#318bff]" />
                    <div className="absolute left-[40px] size-[6px] top-[9px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
                        <circle cx="3" cy="3" fill="#FF3737" r="3" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Dialog
        open={!!clientSelectionState}
        onOpenChange={(open) => {
          if (!open) setClientSelectionState(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Выберите своего покупателя</DialogTitle>
            <DialogDescription>
              Это обязательный шаг перед формированием предложения комиссии.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            {myClients.map((client) => (
              <button
                key={client.id}
                onClick={() =>
                  setClientSelectionState((prev) =>
                    prev ? { ...prev, selectedClientId: client.id } : prev,
                  )
                }
                className={`w-full rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                  clientSelectionState?.selectedClientId === client.id
                    ? "border-[#318bff] bg-[#ecf7ff] text-[#0d0d0d]"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                {client.name}
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setClientSelectionState(null)}>
              Отмена
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
              onClick={handleConfirmClientSelection}
              disabled={!clientSelectionState?.selectedClientId}
            >
              Продолжить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!existingDiscussionState}
        onOpenChange={(open) => {
          if (!open) setExistingDiscussionState(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Обсуждение уже идет</DialogTitle>
            <DialogDescription>
              {`Обсуждение уже идет по клиенту: ${existingDiscussionState?.clientName || ""}`}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                if (!existingDiscussionState) return;
                handleOpenExistingChat(
                  existingDiscussionState.chatId,
                  existingDiscussionState.propertyId,
                  existingDiscussionState.clientName,
                );
              }}
            >
              Открыть чат
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
              onClick={() => {
                if (!existingDiscussionState) return;
                setExistingDiscussionState(null);
                setClientSelectionState({
                  propertyId: existingDiscussionState.propertyId,
                  selectedClientId: existingDiscussionState.clientId,
                });
              }}
            >
              Предложить по новому
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!proposalModalState}
        onOpenChange={(open) => {
          if (!open) setProposalModalState(null);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Предложить деление комиссии</DialogTitle>
            <DialogDescription>
              Формализованное предложение встречному агенту без перехода в МЛС Терминал.
            </DialogDescription>
          </DialogHeader>

          {proposalModalState && (
            <div className="space-y-5">
              {(() => {
                const property = getPropertyById(proposalModalState.propertyId);
                if (!property) return null;
                return (
                  <>
                    <div className="space-y-3">
                      <h4 className="text-sm text-gray-700">Информация</h4>
                      <div className="rounded-md border border-gray-200 p-3 space-y-2">
                        <p className="text-sm text-gray-900">
                          <span className="text-gray-500">Мой объект:</span> {property.location}
                        </p>
                        <p className="text-sm text-gray-900">
                          <span className="text-gray-500">Цена:</span> {property.price}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="rounded-md border border-gray-200 p-3 space-y-2">
                          <p className="text-sm text-gray-700">Мои условия</p>
                          <p className="text-sm text-gray-900">
                            Готов делиться: {property.myCommissionReady}
                          </p>
                          <p className="text-sm text-gray-900">
                            Размер и тип:{" "}
                            {property.myCommissionValue
                              ? `${property.myCommissionValue} (${property.myCommissionType})`
                              : "Не указано"}
                          </p>
                        </div>
                        <div className="rounded-md border border-gray-200 p-3 space-y-2">
                          <p className="text-sm text-gray-700">Условия встречного агента</p>
                          <p className="text-sm text-gray-900">
                            Готов делиться: {property.partnerCommissionReady || "Не указано"}
                          </p>
                          <p className="text-sm text-gray-900">
                            Размер и тип:{" "}
                            {property.partnerCommissionValue && property.partnerCommissionType
                              ? `${property.partnerCommissionValue} (${property.partnerCommissionType})`
                              : "Не указано"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm text-gray-700">Мое предложение</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label>Тип комиссии</Label>
                          <select
                            value={proposalModalState.commissionType}
                            onChange={(e) =>
                              setProposalModalState((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      commissionType: e.target.value as ProposalModalState["commissionType"],
                                    }
                                  : prev,
                              )
                            }
                            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                          >
                            <option>% от суммы сделки</option>
                            <option>% от моей комиссии</option>
                            <option>Фикс</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label>Значение комиссии</Label>
                          <Input
                            value={proposalModalState.commissionValue}
                            onChange={(e) =>
                              setProposalModalState((prev) =>
                                prev ? { ...prev, commissionValue: e.target.value } : prev,
                              )
                            }
                            placeholder="Например: 50"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Краткий текст сообщения (необязательно)</Label>
                        <Textarea
                          value={proposalModalState.message}
                          onChange={(e) =>
                            setProposalModalState((prev) =>
                              prev ? { ...prev, message: e.target.value } : prev,
                            )
                          }
                          className="min-h-[90px]"
                        />
                      </div>

                      <div className="rounded-md bg-[#f5f9ff] border border-[#dce9ff] p-3">
                        <p className="text-sm text-[#2d5ea8]">
                          {`Предлагаю распределить комиссию следующим образом: ${
                            proposalModalState.commissionValue || "—"
                          } (${proposalModalState.commissionType}).`}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setProposalModalState(null)}>
              Отмена
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
              onClick={handleSubmitProposal}
              disabled={!proposalModalState?.commissionValue.trim()}
            >
              Отправить предложение
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
