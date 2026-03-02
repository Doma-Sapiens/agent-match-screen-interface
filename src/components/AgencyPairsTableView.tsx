import { useState } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import { Button } from "./ui/button";
import { MessageCircle } from "lucide-react";
import { AgencyDirectorChat } from "./AgencyDirectorChat";

interface AgencyPairsTableViewProps {
  onAgencyClick: (agencyName: string, targetTab?: string) => void;
  onSwitchToMyPairs: () => void;
  onTasksClick?: () => void;
  tasksCount?: number;
  onBackToMenu: () => void;
}

function IconMenu() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="icon-menu/продавцы">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="icon-menu/Ð¿ÑÐ¾Ð´Ð°Ð²ÑÑ">
          <g clipPath="url(#clip0_49_399)">
            <g id="icon/menu/Ð¿ÑÐ¾Ð´Ð°Ð²ÑÑ">
              <path d={svgPaths.p1a7ccd80} fill="url(#paint0_linear_49_399)" />
              <path d={svgPaths.pcf11280} fill="var(--fill-0, white)" />
              <path d={svgPaths.p2e54cb00} fill="var(--fill-0, white)" />
              <path d={svgPaths.p8823d80} fill="var(--fill-0, white)" />
              <path d={svgPaths.p4bd9f80} fill="var(--fill-0, white)" />
            </g>
          </g>
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_49_399" x1="20" x2="20" y1="0" y2="40">
            <stop stopColor="#FB5976" />
            <stop offset="1" stopColor="#FA243B" />
          </linearGradient>
          <clipPath id="clip0_49_399">
            <rect fill="white" height="40" rx="8" width="40" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconStreaming() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/streaming">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/streaming">
          <path d={svgPaths.p4127880} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconChat() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/chat">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/chat">
          <path clipRule="evenodd" d={svgPaths.p28356580} fill="var(--fill-0, #318BFF)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconPhone() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/phone">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/phone">
          <path d={svgPaths.p1c59e800} fill="var(--fill-0, #318BFF)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function IconSearch() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/search">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="icon/search">
          <g id="Vector">
            <path d={svgPaths.p1fd693f0} fill="var(--fill-0, #318BFF)" />
            <path clipRule="evenodd" d={svgPaths.pd757500} fill="var(--fill-0, #318BFF)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconBill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]" data-name="icon/bill-1">
      <div className="absolute inset-0 overflow-clip" data-name="Frame">
        <div className="absolute h-[19px] left-[calc(50%+0.341px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[16.683px]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 19">
            <path clipRule="evenodd" d={svgPaths.p19868900} fill="var(--fill-0, #318BFF)" fillRule="evenodd" id="Vector" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function SortIcon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="стрелки">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="ÑÑÑÐµÐ»ÐºÐ¸">
          <path d={svgPaths.p105c8000} fill="var(--fill-0, #6C6C6C)" id="Layer 47" />
        </g>
      </svg>
    </div>
  );
}

export function AgencyPairsTableView({ onAgencyClick, onSwitchToMyPairs, onTasksClick, tasksCount = 3, onBackToMenu }: AgencyPairsTableViewProps) {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [selectedAgency, setSelectedAgency] = useState<any>(null);

  const agencyData = [
    {
      id: 1,
      agency: {
        name: "МИР КВАРТИР",
        logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWFsJTIwZXN0YXRlJTIwbG9nb3xlbnwxfHx8fDE3NTk5MTc2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080",
        director: "Михайлов Сергей Анатольевич",
        email: "director@mir-kvartir.ru",
        phone: "+7 812 234-56-78"
      },
      myAgentsWithPairs: "6 агентов",
      matching: {
        objects: 12,
        buyers: 28,
        reverseBuyers: 15,
        reverseObjects: 18
      },
      potential: {
        amount: "42 800 000 ₽",
        deals: 24
      },
      clientsToActualize: 8,
      shows: {
        completed: 45,
        scheduled: 12
      },
      deals: {
        completed: 16,
        commission: "1 200 000 ₽"
      }
    },
    {
      id: 2,
      agency: {
        name: "ЭЛИТ НЕДВИЖИМОСТЬ",
        logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidWlsZGluZyUyMGxvZ28lMjBpY29ufGVufDF8fHx8MTc1OTkxNzY1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
        director: "Кузнецова Елена Владимировна",
        email: "kuznetsova@elite-spb.ru",
        phone: "+7 812 345-67-89"
      },
      myAgentsWithPairs: "4 агента",
      matching: {
        objects: 8,
        buyers: 18,
        reverseBuyers: 9,
        reverseObjects: 12
      },
      potential: {
        amount: "28 400 000 ₽",
        deals: 16
      },
      clientsToActualize: 5,
      shows: {
        completed: 32,
        scheduled: 7
      },
      deals: {
        completed: 9,
        commission: "750 000 ₽"
      }
    },
    {
      id: 3,
      agency: {
        name: "ПРЕМИУМ РИЭЛТИ",
        logo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVtaXVtJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzU5OTE3NjU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        director: "Петров Александр Дмитриевич",
        email: "petrov@premium-realty.com",
        phone: "+7 812 456-78-90"
      },
      myAgentsWithPairs: "8 агентов",
      matching: {
        objects: 18,
        buyers: 35,
        reverseBuyers: 22,
        reverseObjects: 26
      },
      potential: {
        amount: "56 700 000 ₽",
        deals: 31
      },
      clientsToActualize: 12,
      shows: {
        completed: 67,
        scheduled: 18
      },
      deals: {
        completed: 24,
        commission: "1 850 000 ₽"
      }
    },
    {
      id: 4,
      agency: {
        name: "ГОРОДСКИЕ КВАРТИРЫ",
        logo: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwYnVpbGRpbmdzfGVufDF8fHx8MTc1OTkxNzY1OXww&ixlib=rb-4.1.0&q=80&w=1080",
        director: "Смирнова Анна Сергеевна",
        email: "smirnova@city-apartments.ru",
        phone: "+7 812 567-89-01"
      },
      myAgentsWithPairs: "3 агента",
      matching: {
        objects: 5,
        buyers: 11,
        reverseBuyers: 6,
        reverseObjects: 8
      },
      potential: {
        amount: "18 600 000 ₽",
        deals: 9
      },
      clientsToActualize: 3,
      shows: {
        completed: 22,
        scheduled: 4
      },
      deals: {
        completed: 6,
        commission: "420 000 ₽"
      }
    }
  ];

  const handleContactDirector = (agency: any) => {
    setSelectedAgency(agency);
    setActiveChat("director-chat");
  };

  // Если открыт чат с директором
  if (activeChat === "director-chat" && selectedAgency) {
    return (
      <AgencyDirectorChat
        onBack={() => {
          setActiveChat(null);
          setSelectedAgency(null);
        }}
        agency={selectedAgency}
        myAgency="Агентство Петра Иванова"
      />
    );
  }

  return (
    <div className="bg-[#eff4f8] content-stretch flex flex-col gap-[20px] items-start relative size-full" data-name="Таблица">
      {/* Шапка */}
      <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip pl-0 pr-[20px] py-0 relative shadow-[0px_4px_10px_0px_rgba(0,0,0,0.06)] shrink-0 w-full">
        {/* Левая часть - табы навигации */}
        <div className="content-stretch flex items-center relative shrink-0">
          {onBackToMenu && (
            <button
              onClick={onBackToMenu}
              className="bg-white box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center px-[20px] py-[16px] relative shrink-0 hover:bg-gray-50 transition-colors"
              title="Вернуться в главное меню"
            >
              <svg className="size-[24px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          )}
          <div className="bg-white box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center px-[20px] py-[16px] relative shrink-0">
            <IconMenu />
          </div>
          <button 
            onClick={onSwitchToMyPairs}
            className="bg-white box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center px-[20px] py-[17px] relative shrink-0 hover:bg-gray-50 transition-colors"
          >
            <p className="font-normal leading-[22px] relative shrink-0 text-[#0d0d0d] text-[16px] text-nowrap whitespace-pre">
              Мои пары
            </p>
          </button>
          <div className="bg-[#318bff] box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[17px] relative shrink-0">
            <p className="font-semibold leading-[22px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
              Пары агентства
            </p>
          </div>
        </div>

        {/* Правая часть - действия */}
        <div className="content-stretch flex gap-[24px] h-[56px] items-center relative shrink-0">
          <div className="bg-[#fe3c3b] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0">
            <IconStreaming />
            <p className="font-semibold leading-[22px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
              Live
            </p>
          </div>
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
            {/* Иконка задач с бейджем */}
            {onTasksClick && (
              <button 
                onClick={onTasksClick}
                className="relative shrink-0 size-[24px] hover:opacity-80 transition-opacity cursor-pointer"
                title="Здесь появляются предложения от других агентов: деление комиссии, назначение показов и др."
              >
                <svg className="block size-full" fill="none" viewBox="0 0 24 24" stroke="#318BFF" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                {tasksCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-semibold">
                    {tasksCount}
                  </div>
                )}
              </button>
            )}
            <div className="relative shrink-0 size-[24px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <g id="Frame">
                  <g id="Vector">
                    <path d={svgPaths.p3a07c600} fill="var(--fill-0, #318BFF)" />
                    <path d={svgPaths.p24888500} fill="var(--fill-0, #318BFF)" />
                  </g>
                </g>
              </svg>
            </div>
            <IconChat />
            <IconPhone />
            <IconSearch />
            <IconBill />
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="[grid-area:1_/_1] ml-[3px] mt-[3px] relative size-[40px]">
              <img alt="" className="block max-w-none size-full" height="40" src={imgEllipse68} width="40" />
            </div>
            <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[46px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 46 46">
                <circle cx="23" cy="23" id="Ellipse 69" r="22" stroke="var(--stroke-0, #318BFF)" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Основное содержимое */}
      <div className="relative shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[40px] items-start px-[20px] py-0 relative w-full">
            {/* Описание */}
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              <p className="text-gray-600 text-[16px] leading-[24px]">
                Пары агентства — потенциальное сотрудничество с другими АН на основе общих метчей.
              </p>
            </div>

            {/* Таблица */}
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              <p className="font-semibold leading-[18px] relative shrink-0 text-[#0d0d0d] text-[20px] text-nowrap whitespace-pre">
                Пары агентства - {agencyData.length}
              </p>
              
              {/* Таблица на CSS Grid */}
              <div className="w-full bg-white rounded-[10px] overflow-hidden border border-[#add1ff]">
                {/* Заголовки таблицы */}
                <div className="grid grid-cols-[50px_280px_160px_280px_180px_140px_140px_140px] bg-[#ebf4ff] border-b border-[#add1ff]">
                  <div className="p-2 border-r border-[#add1ff] flex items-center">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">№</span>
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Агентство</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Мои агенты с парами</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Метчинг карточек</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Потенциал сделок</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Клиенты которых нужно актуализировать</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Количество показов</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Количество сделок</span>
                    <SortIcon />
                  </div>
                </div>

                {/* Строки таблицы */}
                {agencyData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-[50px_280px_160px_280px_180px_140px_140px_140px] bg-white ${index < agencyData.length - 1 ? 'border-b border-[#d6e8ff]' : ''}`}>
                    {/* № */}
                    <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                      <span className="text-[14px] text-[#0d0d0d]">{index + 1}</span>
                    </div>

                    {/* Агентство */}
                    <div className="p-2 border-r border-[#d6e8ff] flex items-center gap-3">
                      <img src={row.agency.logo} alt="" className="w-8 h-8 rounded object-cover" />
                      <div className="flex flex-col gap-1">
                        <span className="text-[14px] text-[#0d0d0d] font-medium">
                          {row.agency.name}
                        </span>
                        <span className="text-[12px] text-gray-500">{row.agency.director}</span>
                        <Button
                          onClick={() => handleContactDirector(row.agency)}
                          className="bg-[#318bff] hover:bg-[#1976d2] text-white text-[11px] px-2 py-0.5 h-5 w-fit"
                        >
                          Написать
                        </Button>
                      </div>
                    </div>

                    {/* Мои агенты с парами */}
                    <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                      <span className="text-[14px] text-[#0d0d0d]">{row.myAgentsWithPairs}</span>
                    </div>

                    {/* Метчинг карточек */}
                    <div className="p-2 border-r border-[#d6e8ff] flex flex-col gap-1">
                      <button 
                        onClick={() => onAgencyClick(row.agency.name, "suitable-buyers")}
                        className="text-left text-[14px] text-[#318bff] hover:underline cursor-pointer transition-colors hover:text-[#1976d2]"
                      >
                        {row.matching.objects} объектов → {row.matching.buyers} покупателей
                      </button>
                      <button 
                        onClick={() => onAgencyClick(row.agency.name, "sellers-tinder")}
                        className="text-left text-[14px] text-[#318bff] hover:underline cursor-pointer transition-colors hover:text-[#1976d2]"
                      >
                        {row.matching.reverseBuyers} покупателей → {row.matching.reverseObjects} объектов
                      </button>
                    </div>

                    {/* Потенциал сделок */}
                    <div className="p-2 border-r border-[#d6e8ff] flex flex-col gap-1">
                      <span className="text-[16px] font-semibold text-[#0d0d0d]">{row.potential.amount}</span>
                      <span className="text-[14px] text-[#0d0d0d]">{row.potential.deals} сделок</span>
                    </div>

                    {/* Клиенты которых нужно актуализировать */}
                    <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                      <span className="text-[14px] text-[#0d0d0d]">{row.clientsToActualize}</span>
                    </div>

                    {/* Количество показов */}
                    <div className="p-2 border-r border-[#d6e8ff] flex flex-col gap-1">
                      <div className="text-[14px] text-[#0d0d0d]">
                        <span className="text-[#848484]">Проведено: </span>
                        <span>{row.shows.completed}</span>
                      </div>
                      <div className="text-[14px] text-[#0d0d0d]">
                        <span className="text-[#848484]">Назначено: </span>
                        <span>{row.shows.scheduled}</span>
                      </div>
                    </div>

                    {/* Количество сделок */}
                    <div className="p-2 flex flex-col gap-1">
                      <div className="text-[14px] text-[#0d0d0d]">
                        <span className="text-[#848484]">Проведено: </span>
                        <span>{row.deals.completed}</span>
                      </div>
                      <div className="text-[14px] text-[#0d0d0d]">
                        <span className="text-[#848484]">сумма КВ: </span>
                        <span className="font-semibold">{row.deals.commission}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}