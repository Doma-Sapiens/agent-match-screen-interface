import { useState } from "react";
import { ArrowLeft, Search, Plus, MapPin, MessageCircle, MoreVertical, SlidersHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import svgPaths from "../imports/svg-mic4nfy4kl";

interface BuyersRequestsViewProps {
  onBack?: () => void;
}

interface BuyerRequest {
  id: string;
  responsible: string;
  photo: string;
  contactName: string;
  contactPhone: string;
  propertyType: string;
  propertySubtype: string;
  price: string;
  location: string;
  district: string;
  metro: string;
  createdDate: string;
  modifiedDate: string;
  leadStatus: string;
  objectsCount: number;
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

export function BuyersRequestsView({ onBack }: BuyersRequestsViewProps) {
  const [activeTab, setActiveTab] = useState("company");
  const [activeFilter, setActiveFilter] = useState("leads24h");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  // Моковые данные покупателей
  const buyerRequests: BuyerRequest[] = [
    {
      id: "120573945",
      responsible: "Константино Рафаэль",
      photo: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGF2YXRhcnxlbnwxfHx8fDE3NTk1NDc5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      contactName: "Лилия",
      contactPhone: "+7 981 775 53 60",
      propertyType: "Квартира",
      propertySubtype: "1 комн.",
      price: "9 650 000 —",
      location: "г. Ужен-Уд, Октябрьский р-н, ул. Ивановская, д. 23 корпус 5 и д.д.",
      district: "Центральный р-н",
      metro: "—",
      createdDate: "10.10.2005, 14:21",
      modifiedDate: "10.10.2005, 15:28",
      leadStatus: "СБОР ДАННЫХ",
      objectsCount: 111
    },
    {
      id: "120573946",
      responsible: "Константино Рафаэль",
      photo: "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      contactName: "Павел",
      contactPhone: "+7 911 234 56 78",
      propertyType: "Квартира",
      propertySubtype: "2 комн.",
      price: "До 7 000 000",
      location: "г. Санкт-Петербург, Лиды (24 ч.) — 3 часа",
      district: "Адмиралтейский",
      metro: "Садовая",
      createdDate: "09.10.2005, 10:15",
      modifiedDate: "10.10.2005, 12:45",
      leadStatus: "СБОР ДАННЫХ",
      objectsCount: 24
    }
  ];

  const filterCounts = {
    overdue: 118,
    all: 170,
    callCenter: 0,
    leads24h: 24,
    readyForDeposit: 311,
    agreement10d: 9,
    depositMade: 8
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRequests(buyerRequests.map(r => r.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (requestId: string, checked: boolean) => {
    if (checked) {
      setSelectedRequests([...selectedRequests, requestId]);
    } else {
      setSelectedRequests(selectedRequests.filter(id => id !== requestId));
    }
  };

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
                Покупатели, Заявки компании – {filterCounts.all}
              </h1>
              <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                Управление заявками покупателей
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Поиск */}
            <div className="relative w-[280px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск по заявкам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            {/* Создать заявку */}
            <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white gap-2">
              <Plus className="w-4 h-4" />
              Создать заявку
            </Button>

            {/* Фильтр */}
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              Фильтр
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
                Мои заявки
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF] rounded-none px-6 h-12"
              >
                Заявки компании
              </TabsTrigger>
              <TabsTrigger
                value="contacts"
                className="data-[state=active]:bg-transparent data-[state=active]:text-[#007BFF] data-[state=active]:border-b-2 data-[state=active]:border-[#007BFF] rounded-none px-6 h-12"
              >
                Контакт-центр
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
            Перезанимает в агентство ({filterCounts.readyForDeposit})
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
            Готовы к задатку/сделке ({filterCounts.agreement10d})
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
          {buyerRequests.map((request, index) => (
            <div 
              key={request.id}
              className="relative mb-4 bg-white rounded-lg border border-[#e5effc] shadow-[0px_4px_15px_0px_rgba(28,105,255,0.06)] overflow-hidden"
            >
              {/* Строка таблицы */}
              <div className="flex items-start relative">
                {/* Чекбокс */}
                <div className="bg-white flex flex-col items-center p-[10px] w-[36px] border-r border-[#f3f3f3] shadow-[2px_0px_6px_0px_rgba(0,0,0,0.04)]">
                  <Checkbox
                    checked={selectedRequests.includes(request.id)}
                    onCheckedChange={(checked) => handleSelectRequest(request.id, checked as boolean)}
                  />
                  <p className="text-[#848484] text-[14px] text-center mt-2" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {index + 1}
                  </p>
                </div>

                {/* Фото */}
                <div className="bg-white flex flex-col gap-[10px] p-[10px] w-[152px] border-r border-[#f3f3f3]">
                  <div className="relative bg-[#f3f3f3] rounded-[10px] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.06)] h-[96px] w-[132px] overflow-hidden">
                    <img 
                      src={request.photo} 
                      alt="Покупатель"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Ответственный */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[180px] border-r border-[#f3f3f3]">
                  <p className="text-[#318bff] text-[14px]">{request.responsible}</p>
                  <p className="text-[#848484] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Агент 007
                  </p>
                  <p className="text-[#3b3b3b] text-[13px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Название компании
                  </p>
                  <button className="bg-white border border-[#318bff] rounded-[7px] px-[10px] py-[4px] flex items-center gap-[6px] w-fit">
                    <MessageCircle className="w-[16px] h-[16px] text-[#318bff]" />
                    <span className="text-[#318bff] text-[13px]">Написать</span>
                  </button>
                </div>

                {/* Контакты */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[200px] border-r border-[#f3f3f3]">
                  <div className="flex items-center gap-[8px]">
                    <div className="bg-[#ffcb00] rounded-full size-[8px]"></div>
                    <div className="flex items-center gap-[4px]">
                      <p className="text-[#318bff] text-[14px]">{request.contactName}</p>
                      <SortArrow />
                    </div>
                  </div>
                  <p className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {request.contactPhone}
                  </p>
                  <button className="bg-white border border-[#318bff] rounded-[7px] px-[10px] py-[6px] text-[#318bff] text-[13px] w-fit">
                    Написать сообщение
                  </button>
                </div>

                {/* Тип объекта */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[160px] border-r border-[#f3f3f3]">
                  <p className="text-[#0d0d0d] text-[14px]">{request.propertyType}</p>
                  <p className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {request.propertySubtype}
                  </p>
                  <p className="text-[#848484] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Стандартная
                  </p>
                </div>

                {/* Расположение */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[300px] border-r border-[#f3f3f3]">
                  <div className="flex gap-[10px] items-start">
                    <MapPin className="w-[20px] h-[20px] text-[#318bff] flex-shrink-0 mt-0.5" />
                    <div className="flex flex-col gap-[10px]">
                      <p className="text-[#318bff] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {request.location}
                      </p>
                      <p className="text-[#0d0d0d] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                        {request.district}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Метро */}
                <div className="bg-white flex flex-col gap-[6px] p-[16px] w-[180px] border-r border-[#f3f3f3]">
                  <div className="flex gap-[5px] items-center">
                    <div className="relative shrink-0 size-[20px]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
                        <g>
                          <path d={svgPaths.p3adcbf80} fill="#318BFF" />
                        </g>
                      </svg>
                    </div>
                    <p className="text-[#0d0d0d] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap w-[120px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {request.metro}
                    </p>
                  </div>
                </div>

                {/* Цена */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[140px] border-r border-[#f3f3f3]">
                  <p className="text-[#0d0d0d] text-[16px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    {request.price}
                  </p>
                  <p className="text-[#848484] text-[14px] overflow-ellipsis overflow-hidden whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Рыночная цена
                  </p>
                </div>

                {/* Комиссия */}
                <div className="bg-white flex flex-col gap-[10px] p-[16px] w-[156px]">
                  <p className="text-[#0d0d0d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    100%
                  </p>
                  <p className="text-[#848484] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Комиссия агентства
                  </p>
                </div>
              </div>

              {/* Детали заявки */}
              <div className="bg-white border-t border-[#f3f3f3] px-[10px] py-[6px] flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  {/* ID заявки */}
                  <div className="bg-[#ecf7ff] border border-[#e5effc] rounded-[5px] px-[10px] py-[2px] flex items-center gap-[6px]">
                    <p className="text-[#318bff] text-[13px]">id-{request.id}</p>
                  </div>

                  {/* Статус */}
                  {activeFilter === "leads24h" && (
                    <div className="bg-[#ebf8ee] border border-[#e5effc] rounded-[5px] px-[10px] py-[7px]">
                      <p className="text-[#008937] text-[14px]">Лиды (24 ч.) — 3 часа</p>
                    </div>
                  )}

                  {/* Дата создания */}
                  <div className="bg-[#f3f3f3] rounded-[5px] px-[10px] py-[2px] flex items-center gap-[4px]">
                    <p className="text-[#848484] text-[13px] w-[136px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <span className="text-[#0d0d0d]">Созд:</span> {request.createdDate}
                    </p>
                    <SortArrow />
                  </div>

                  {/* Дата изменения */}
                  <div className="bg-[#f3f3f3] rounded-[5px] px-[10px] py-[2px] flex items-center gap-[4px]">
                    <p className="text-[#848484] text-[13px] w-[132px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      <span className="text-[#3b3b3b]">Изм:</span> {request.modifiedDate}
                    </p>
                    <SortArrow />
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center gap-[10px]">
                  <button className="bg-[#ecf7ff] border border-[#e5effc] rounded-[8px] px-[16px] py-[10px] text-[#318bff] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Объектов {request.objectsCount}
                  </button>
                  <button className="bg-[#ebf8f5] border border-[#e5effc] rounded-[8px] px-[16px] py-[10px] text-[#05a87c] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Создать сделку
                  </button>
                  <button className="bg-[#ecf7ff] border border-[#e5effc] rounded-[8px] px-[20px] py-[10px] w-[60px] h-[32px] flex items-center justify-center relative">
                    <MoreVertical className="w-[20px] h-[20px] text-[#318bff]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
