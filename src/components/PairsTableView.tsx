import { useState, useEffect } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import imgEllipse210 from "figma:asset/9937a96027ff14721eb62cc95f737da6fc09ba02.png";
import { Button } from "./ui/button";
import { Award, MessageSquare } from "lucide-react";
import { AgentContactModalTable } from "./AgentContactModalTable";
import { DefaultCommissionModal } from "./DefaultCommissionModal";
import { MLSFeedbackModal } from "./MLSFeedbackModal";

interface PairsTableViewProps {
  onPairClick: (agentName: string, targetTab?: string) => void;
  onSwitchToAgencyPairs: () => void;
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

export function PairsTableView({ onPairClick, onSwitchToAgencyPairs, onTasksClick, tasksCount = 3, onBackToMenu }: PairsTableViewProps) {
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [showDefaultCommissionModal, setShowDefaultCommissionModal] = useState(false);
  const [defaultCommission, setDefaultCommission] = useState<number | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Проверяем при загрузке компонента, нужно ли показать модалку дефолтной комиссии
  useEffect(() => {
    const commissionSet = localStorage.getItem("defaultCommissionSet");
    const dontShowAgain = localStorage.getItem("defaultCommissionDontShow");
    
    // Показываем модалку только если комиссия не была установлена и пользователь не отключил показ
    if (!commissionSet && dontShowAgain !== "true") {
      setShowDefaultCommissionModal(true);
    } else if (commissionSet) {
      // Загружаем сохраненное значение
      const savedCommission = localStorage.getItem("defaultCommission");
      if (savedCommission) {
        setDefaultCommission(parseFloat(savedCommission));
      }
    }
  }, []);

  const handleDefaultCommissionSave = (commission: number | null, dontShowAgain: boolean) => {
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

  const tableData = [
    {
      id: 198216,
      agent: {
        name: "Фивейская Олеся Олеговна",
        avatar: "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        hasMedal: true,
        company: "МИР КВАРТИР",
        phone: "+7 921 ...показать",
        email: "fiveyskaya@mkelite.pro"
      },
      agency: "МИР КВАРТИР",
      matching: {
        objects: 3,
        buyers: 8,
        reverseBuyers: 4,
        reverseObjects: 5
      },
      potential: {
        amount: "15 200 000 ₽",
        deals: 9
      },
      clientsToActualize: 3,
      shows: {
        completed: 12,
        scheduled: 2
      },
      deals: {
        completed: 4,
        commission: "450 000 ₽"
      }
    },
    {
      id: 156789,
      agent: {
        name: "Андрей Смирнов",
        avatar: "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        hasMedal: false,
        company: "ЭЛИТ НЕДВИЖИМОСТЬ",
        phone: "+7 812 ...показать",
        email: "smirnov@elite-spb.ru"
      },
      agency: "ЭЛИТ НЕДВИЖИМОСТЬ",
      matching: {
        objects: 2,
        buyers: 5,
        reverseBuyers: 3,
        reverseObjects: 4
      },
      potential: {
        amount: "8 500 000 ₽",
        deals: 5
      },
      clientsToActualize: 1,
      shows: {
        completed: 8,
        scheduled: 1
      },
      deals: {
        completed: 2,
        commission: "250 000 ₽"
      }
    },
    {
      id: 134567,
      agent: {
        name: "Екатерина Волкова",
        avatar: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        hasMedal: true,
        company: "ПРЕМИУМ Р��ЭЛТИ",
        phone: "+7 921 ...показать",
        email: "volkova@premium-realty.com"
      },
      agency: "ПРЕМИУМ РИЭЛТИ",
      matching: {
        objects: 4,
        buyers: 7,
        reverseBuyers: 5,
        reverseObjects: 6
      },
      potential: {
        amount: "18 900 000 ₽",
        deals: 11
      },
      clientsToActualize: 4,
      shows: {
        completed: 15,
        scheduled: 3
      },
      deals: {
        completed: 6,
        commission: "580 000 ₽"
      }
    },
    {
      id: 145892,
      agent: {
        name: "Владимир Петров",
        avatar: "https://images.unsplash.com/photo-1592878995758-02b32ddabdd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXR1cmUlMjBidXNpbmVzcyUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHN1aXR8ZW58MXx8fHwxNzU5OTE3MTM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
        hasMedal: false,
        company: "ГОРОДСКИЕ КВАРТИРЫ",
        phone: "+7 812 ...показать",
        email: "petrov@city-apartments.ru"
      },
      agency: "ГОРОДСКИЕ КВАРТИРЫ",
      matching: {
        objects: 1,
        buyers: 3,
        reverseBuyers: 2,
        reverseObjects: 3
      },
      potential: {
        amount: "6 200 000 ₽",
        deals: 3
      },
      clientsToActualize: 2,
      shows: {
        completed: 5,
        scheduled: 0
      },
      deals: {
        completed: 1,
        commission: "180 000 ₽"
      }
    }
  ];

  const handleAgentClick = (agent: any) => {
    setSelectedAgent(agent);
    setShowContactModal(true);
  };

  const handleFeedbackSubmit = (rating: number, feedback: string) => {
    console.log("Feedback submitted:", { rating, feedback });
    // Здесь можно отправить данные на сервер
  };

  const handleRemindLater = () => {
    console.log("Remind later clicked");
    // Здесь можно установить напоминание
  };

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
          <div className="bg-[#318bff] box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[17px] relative shrink-0">
            <p className="font-semibold leading-[22px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
              Мои пары
            </p>
          </div>
          <button 
            onClick={onSwitchToAgencyPairs}
            className="bg-white box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center px-[20px] py-[17px] relative shrink-0 hover:bg-gray-50 transition-colors"
          >
            <p className="font-normal leading-[22px] relative shrink-0 text-[#0d0d0d] text-[16px] text-nowrap whitespace-pre">
              Пары агентства
            </p>
          </button>
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
            {/* Вкладки */}
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
                  <div className="bg-[#318bff] box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0">
                    <p className="font-semibold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap text-white whitespace-pre">
                      Мои пары
                    </p>
                  </div>
                  <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0">
                    <div aria-hidden="true" className="absolute border border-[#e5effc] border-solid inset-0 pointer-events-none rounded-[10px]" />
                    <p className="font-normal leading-[1.4] relative shrink-0 text-[#0d0d0d] text-[16px] text-center text-nowrap whitespace-pre">
                      Пары подчинённых
                    </p>
                  </div>
                  <div className="bg-white box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0">
                    <div aria-hidden="true" className="absolute border border-[#e5effc] border-solid inset-0 pointer-events-none rounded-[10px]" />
                    <p className="font-normal leading-[1.4] relative shrink-0 text-[#0d0d0d] text-[16px] text-center text-nowrap whitespace-pre">
                      Отдел/сотрудников
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Таблица */}
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              <p className="font-semibold leading-[18px] relative shrink-0 text-[#0d0d0d] text-[20px] text-nowrap whitespace-pre">
                Мои пары - 1432
              </p>
              
              {/* Таблица на CSS Grid */}
              <div className="w-full bg-white rounded-[10px] overflow-hidden border border-[#add1ff]">
                {/* Заголовки таблицы */}
                <div className="grid grid-cols-[50px_200px_280px_200px_160px_140px_140px_140px] bg-[#ebf4ff] border-b border-[#add1ff]">
                  <div className="p-2 border-r border-[#add1ff] flex items-center">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">№</span>
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Агент</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Агентство</span>
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
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Кол-во показов</span>
                    <SortIcon />
                  </div>
                  <div className="p-2 flex items-center gap-1">
                    <span className="text-[13px] font-semibold text-[#0d0d0d]">Кол-во сделок</span>
                    <SortIcon />
                  </div>
                </div>

                {/* Строки таблицы */}
                {tableData.map((row, index) => (
                  <div key={index} className={`grid grid-cols-[50px_200px_280px_200px_160px_140px_140px_140px] bg-white ${index < tableData.length - 1 ? 'border-b border-[#d6e8ff]' : ''}`}>
                    {/* № */}
                    <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                      <span className="text-[14px] text-[#0d0d0d]">{index + 1}</span>
                    </div>

                    {/* Агент */}
                    <div className={`p-2 border-r border-[#d6e8ff] flex items-center gap-2 ${row.agent.hasMedal ? 'bg-[#f0f9ff]' : ''}`}>
                      <img src={row.agent.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <button 
                        onClick={() => handleAgentClick({ ...row.agent, id: row.id })}
                        className="text-[14px] text-[#318bff] font-medium hover:underline cursor-pointer transition-colors hover:text-[#1976d2]"
                      >
                        {row.agent.name}
                      </button>
                      {row.agent.hasMedal && (
                        <Award className="w-4 h-4 text-blue-600" />
                      )}
                    </div>

                    {/* Агентство */}
                    <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                      <span className="text-[14px] text-[#0d0d0d] truncate">{row.agency}</span>
                    </div>

                    {/* Метчинг карточек */}
                    <div className="p-2 border-r border-[#d6e8ff] flex flex-col gap-1">
                      <button 
                        onClick={() => onPairClick(row.agent.name, "suitable-buyers")}
                        className="text-left text-[14px] text-[#318bff] hover:underline cursor-pointer transition-colors hover:text-[#1976d2]"
                      >
                        {row.matching.objects} объекта → {row.matching.buyers} покупателей
                      </button>
                      <button 
                        onClick={() => onPairClick(row.agent.name, "sellers-tinder")}
                        className="text-left text-[14px] text-[#318bff] hover:underline cursor-pointer transition-colors hover:text-[#1976d2]"
                      >
                        {row.matching.reverseBuyers} покупателя → {row.matching.reverseObjects} объектов
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

                    {/* Кол-во показов */}
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

                    {/* Кол-во сделок */}
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

      {/* Модалка контактов агента */}
      {selectedAgent && (
        <AgentContactModalTable
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          agent={{
            id: selectedAgent.id || 198216,
            name: selectedAgent.name,
            avatar: selectedAgent.avatar,
            company: selectedAgent.company,
            phone: selectedAgent.phone,
            email: selectedAgent.email
          }}
        />
      )}

      {/* Модалка дефолтной комиссии */}
      <DefaultCommissionModal
        isOpen={showDefaultCommissionModal}
        onClose={() => setShowDefaultCommissionModal(false)}
        onSave={handleDefaultCommissionSave}
      />

      {/* Модалка обратной связи */}
      <MLSFeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        onSubmit={handleFeedbackSubmit}
        onRemindLater={handleRemindLater}
      />

      {/* Кнопка обратной связи в левом нижнем углу */}
      <button
        onClick={() => setShowFeedbackModal(true)}
        className="fixed bottom-6 left-6 bg-[#2F80ED] hover:bg-[#1976D2] text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-50 flex items-center gap-2"
        title="Оставить отзыв о MLS"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    </div>
  );
}