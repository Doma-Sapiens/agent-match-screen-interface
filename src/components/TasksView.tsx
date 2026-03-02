import { useState } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import { Button } from "./ui/button";
import { Award, Calendar, DollarSign, User, ArrowLeft } from "lucide-react";
import { TaskDetailModal } from "./TaskDetailModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface TasksViewProps {
  onBack?: () => void;
}

function IconMenu() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="icon-menu/задачи">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="icon-menu/задачи">
          <rect fill="#318BFF" height="40" rx="8" width="40" />
          <path d="M12 14h16M12 20h16M12 26h10" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
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
        <g id="стрелки">
          <path d={svgPaths.p105c8000} fill="var(--fill-0, #6C6C6C)" id="Layer 47" />
        </g>
      </svg>
    </div>
  );
}

type TaskType = "commission" | "showing" | "confirmation" | "other";
type TaskStatus = "new" | "in-progress" | "completed" | "cancelled";

interface Task {
  id: string;
  type: TaskType;
  agent: {
    name: string;
    avatar: string;
    company: string;
    hasMedal: boolean;
  };
  description: string;
  potential: string;
  date: string;
  status: TaskStatus;
  details: {
    property?: {
      address: string;
      price: string;
      imageUrl: string;
    };
    buyer?: {
      name: string;
      budget: string;
    };
    proposal?: string;
  };
}

export function TasksView({ onBack }: TasksViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const tasks: Task[] = [
    {
      id: "task-1",
      type: "commission",
      agent: {
        name: "Фивейская Олеся Олеговна",
        avatar: "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "МИР КВАРТИР",
        hasMedal: true
      },
      description: "Предлагает деление комиссии 50/50 по объекту на Невском",
      potential: "6 200 000 ₽",
      date: "08.10.2025, 14:30",
      status: "new",
      details: {
        property: {
          address: "ул. Невский проспект, 100",
          price: "6 200 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        buyer: {
          name: "Сергей Ким",
          budget: "6 000 000 ₽"
        },
        proposal: "Предлагаю деление комиссии 50/50. Покупатель готов к сделке, все документы в порядке."
      }
    },
    {
      id: "task-2",
      type: "showing",
      agent: {
        name: "Андрей Смирнов",
        avatar: "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ЭЛИТ НЕДВИЖИМОСТЬ",
        hasMedal: false
      },
      description: "Предлагает назначить показ на 10.10.2025 в 15:00",
      potential: "8 500 000 ₽",
      date: "07.10.2025, 18:20",
      status: "new",
      details: {
        property: {
          address: "наб. реки Мойки, 45",
          price: "5 800 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        buyer: {
          name: "Дмитрий Орлов",
          budget: "7 500 000 ₽"
        },
        proposal: "Мой покупатель готов посмотреть объект 10 октября в 15:00. Подходит ли вам это время?"
      }
    },
    {
      id: "task-3",
      type: "confirmation",
      agent: {
        name: "Екатерина Волкова",
        avatar: "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ПРЕМИУМ РИЭЛТИ",
        hasMedal: true
      },
      description: "Просит подтвердить интерес к паре: покупатель + объект",
      potential: "18 900 000 ₽",
      date: "07.10.2025, 10:15",
      status: "in-progress",
      details: {
        property: {
          address: "ул. Рубинштейна, 23",
          price: "7 900 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080"
        },
        buyer: {
          name: "Михаил Сидоров",
          budget: "8 000 000 ₽"
        },
        proposal: "Видим совпадение между вашим покупателем и моим объектом. Интересно ли вам?"
      }
    }
  ];

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    if (typeFilter !== "all" && task.type !== typeFilter) return false;
    return true;
  });

  const activeTasksCount = tasks.filter(t => t.status === "new" || t.status === "in-progress").length;

  const getTaskTypeLabel = (type: TaskType) => {
    const labels: Record<TaskType, string> = {
      commission: "Деление комиссии",
      showing: "Назначение показа",
      confirmation: "Подтверждение пары",
      other: "Прочее"
    };
    return labels[type];
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels: Record<TaskStatus, string> = {
      new: "Новая",
      "in-progress": "В работе",
      completed: "Выполнена",
      cancelled: "Отменена"
    };
    return labels[status];
  };

  const getStatusColor = (status: TaskStatus) => {
    const colors: Record<TaskStatus, string> = {
      new: "bg-[#D6EEFF] text-[#2D9CDB]",
      "in-progress": "bg-[#FFF4D6] text-[#F2C94C]",
      completed: "bg-[#D4EDDA] text-[#27AE60]",
      cancelled: "bg-[#E8E8E8] text-[#BDBDBD]"
    };
    return colors[status];
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log(`Задача ${taskId}: действие ${action}`);
    // Здесь будет логика обработки действий
  };

  return (
    <div className="bg-[#FAFBFD] content-stretch flex flex-col gap-[20px] items-start relative size-full" data-name="Задачи">
      {/* Шапка */}
      <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip pl-0 pr-[20px] py-0 relative shadow-[0px_4px_10px_0px_rgba(0,0,0,0.06)] shrink-0 w-full">
        {/* Левая часть - иконка */}
        <div className="content-stretch flex items-center relative shrink-0">
          <button 
            onClick={onBack}
            className="bg-white box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center px-[20px] py-[16px] relative shrink-0 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#318bff]" />
          </button>
          <div className="bg-white box-border content-stretch flex gap-[10px] h-[56px] items-center justify-center px-[20px] py-[16px] relative shrink-0">
            <IconMenu />
          </div>
          <div className="bg-[#318bff] box-border content-stretch flex gap-[10px] items-center justify-center px-[20px] py-[17px] relative shrink-0">
            <p className="font-semibold leading-[22px] relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">
              Задачи
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
            {/* Заголовок и фильтры */}
            <div className="content-stretch flex flex-col gap-[20px] items-start relative shrink-0 w-full">
              <div>
                <h2 className="text-gray-900 mb-1">Мои задачи</h2>
                <p className="text-gray-600 text-[16px]">{activeTasksCount} активных задач</p>
              </div>

              {/* Фильтры */}
              <div className="content-stretch flex items-center gap-[10px] relative shrink-0">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`${
                    statusFilter === "all" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
                  } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff]`}
                >
                  <p className="font-semibold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap whitespace-pre">
                    Все
                  </p>
                </button>
                <button
                  onClick={() => setStatusFilter("new")}
                  className={`${
                    statusFilter === "new" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
                  } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff]`}
                >
                  <p className="font-semibold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap whitespace-pre">
                    Новые
                  </p>
                </button>
                <button
                  onClick={() => setStatusFilter("in-progress")}
                  className={`${
                    statusFilter === "in-progress" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
                  } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff]`}
                >
                  <p className="font-semibold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap whitespace-pre">
                    В работе
                  </p>
                </button>
                <button
                  onClick={() => setStatusFilter("completed")}
                  className={`${
                    statusFilter === "completed" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
                  } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff]`}
                >
                  <p className="font-semibold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap whitespace-pre">
                    Выполненные
                  </p>
                </button>
                <button
                  onClick={() => setStatusFilter("cancelled")}
                  className={`${
                    statusFilter === "cancelled" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
                  } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[12px] relative rounded-[10px] shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff]`}
                >
                  <p className="font-semibold leading-[1.4] relative shrink-0 text-[16px] text-center text-nowrap whitespace-pre">
                    Отменённые
                  </p>
                </button>

                {/* Селект типа задачи */}
                <div className="ml-4">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[240px] bg-white border-[#e5effc]">
                      <SelectValue placeholder="Тип задачи" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все типы задач</SelectItem>
                      <SelectItem value="commission">Деление комиссии</SelectItem>
                      <SelectItem value="showing">Назначение показа</SelectItem>
                      <SelectItem value="confirmation">Подтверждение пары</SelectItem>
                      <SelectItem value="other">Прочее</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Таблица задач */}
            {filteredTasks.length > 0 ? (
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                <div className="w-full bg-white rounded-[10px] overflow-hidden border border-[#add1ff]">
                  {/* Заголовки таблицы */}
                  <div className="grid grid-cols-[180px_240px_1fr_160px_160px_140px_200px] bg-[#ebf4ff] border-b border-[#add1ff]">
                    <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Тип задачи</span>
                      <SortIcon />
                    </div>
                    <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Агент-инициатор</span>
                      <SortIcon />
                    </div>
                    <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Краткое описание</span>
                    </div>
                    <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Потенциал сделки</span>
                      <SortIcon />
                    </div>
                    <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Дата поступления</span>
                      <SortIcon />
                    </div>
                    <div className="p-2 border-r border-[#add1ff] flex items-center gap-1">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Статус</span>
                      <SortIcon />
                    </div>
                    <div className="p-2 flex items-center">
                      <span className="text-[13px] font-semibold text-[#0d0d0d]">Действия</span>
                    </div>
                  </div>

                  {/* Строки таблицы */}
                  {filteredTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className={`grid grid-cols-[180px_240px_1fr_160px_160px_140px_200px] ${
                        task.status === "new" ? "bg-[#E8F4FF]" : "bg-[#FAFBFD]"
                      } ${index < filteredTasks.length - 1 ? "border-b border-[#d6e8ff]" : ""} hover:bg-[#EEF3FB] transition-colors cursor-pointer`}
                      style={{ minHeight: "72px", padding: "4px 0" }}
                    >
                      {/* Тип задачи */}
                      <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                        <span className="text-[14px] text-[#0d0d0d] font-medium">{getTaskTypeLabel(task.type)}</span>
                      </div>

                      {/* Агент-инициатор */}
                      <div className="p-2 border-r border-[#d6e8ff] flex items-center gap-2">
                        <img src={task.agent.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-[14px] text-[#0d0d0d] truncate">{task.agent.name.split(" ")[0]} {task.agent.name.split(" ")[1]}</span>
                            {task.agent.hasMedal && <Award className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                          </div>
                          <span className="text-[11px] text-gray-500 truncate">{task.agent.company}</span>
                        </div>
                      </div>

                      {/* Описание */}
                      <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="text-[14px] text-[#318bff] hover:underline text-left"
                        >
                          {task.description}
                        </button>
                      </div>

                      {/* Потенциал */}
                      <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                        <span className="text-[14px] text-[#0d0d0d] font-semibold">{task.potential}</span>
                      </div>

                      {/* Дата */}
                      <div className="p-2 border-r border-[#d6e8ff] flex items-center">
                        <span className="text-[14px] text-[#0d0d0d]">{task.date}</span>
                      </div>

                      {/* Статус */}
                      <div className="p-2 border-r border-[#d6e8ff] flex items-center justify-center">
                        <span className={`text-[12px] px-3 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>

                      {/* Действия */}
                      <div className="p-2 flex items-center gap-1">
                        {task.type === "commission" && task.status === "new" && (
                          <>
                            <Button
                              onClick={() => handleTaskAction(task.id, "accept")}
                              className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-2 py-1 h-6"
                            >
                              Согласиться
                            </Button>
                            <Button
                              onClick={() => handleTaskAction(task.id, "discuss")}
                              className="bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-2 py-1 h-6"
                            >
                              Обсудить
                            </Button>
                          </>
                        )}
                        {task.type === "showing" && task.status === "new" && (
                          <>
                            <Button
                              onClick={() => handleTaskAction(task.id, "accept")}
                              className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-2 py-1 h-6"
                            >
                              Принять
                            </Button>
                            <Button
                              onClick={() => handleTaskAction(task.id, "change")}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] px-2 py-1 h-6"
                            >
                              Изменить
                            </Button>
                          </>
                        )}
                        {task.type === "confirmation" && (
                          <>
                            <Button
                              onClick={() => handleTaskAction(task.id, "confirm")}
                              className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-2 py-1 h-6"
                            >
                              Подтвердить
                            </Button>
                            <Button
                              onClick={() => handleTaskAction(task.id, "not-interested")}
                              className="bg-gray-500 hover:bg-gray-600 text-white text-[11px] px-2 py-1 h-6"
                            >
                              Неинтересно
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Пустое состояние
              <div className="w-full flex flex-col items-center justify-center py-20">
                <div className="text-center max-w-md">
                  <div className="mb-6">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-gray-900 mb-2">У вас пока нет новых задач</h3>
                  <p className="text-gray-600">
                    Как только появятся предложения от других агентов — они отобразятся здесь.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалка с деталями задачи */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onAction={(action) => {
            handleTaskAction(selectedTask.id, action);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
}