import { useState } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import { Button } from "./ui/button";
import { Award, Calendar, DollarSign, User, ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Bell, Settings, X, Eye, EyeOff } from "lucide-react";
import { TaskDetailModal } from "./TaskDetailModal";
import { NotificationsSettingsModal } from "./NotificationsSettingsModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface TasksViewV3v2Props {
  onBack?: () => void;
  onOpenChat?: (task: Task) => void;
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

type TaskType = "commission" | "showing" | "confirmation" | "other" | "system" | "system-new-pair" | "system-new-object" | "system-showing-done" | "system-commission-check" | "system-update-request";
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
  isSystem?: boolean;
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
    partnerAgent?: {
      name: string;
      avatar: string;
      agency: string;
      phone: string;
      telegram: string;
      whatsApp: string;
    };
  };
}

export function TasksViewV3v2({ onBack, onOpenChat }: TasksViewV3v2Props) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hiddenSystemTasks, setHiddenSystemTasks] = useState<string[]>([]);

  const systemTasks: Task[] = [
    {
      id: "sys-1",
      type: "system-new-pair",
      agent: { name: "Система MLS", avatar: "", company: "", hasMedal: false },
      description: "Новая пара обнаружена. Свяжитесь с агентом, чтобы обсудить условия сотрудничества.",
      potential: "6 500 000 ₽",
      date: "09.10.2025, 10:30",
      status: "new",
      isSystem: true,
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
        partnerAgent: {
          name: "Олеся Фивейская",
          avatar: "figma:asset/35b5303f3f9bccf38a21ee64aecec4474cd6aaa0.png",
          agency: "Агентство \"Квартал\"",
          phone: "+7 (812) 987-65-43",
          telegram: "https://t.me/olesyafiv",
          whatsApp: "https://wa.me/79129876543"
        }
      }
    },
    {
      id: "sys-2",
      type: "system-new-object",
      agent: { name: "Система MLS", avatar: "", company: "", hasMedal: false },
      description: "Новый объект под покупателя. Напишите агенту для уточнения возможностей сотрудничества.",
      potential: "5 800 000 ₽",
      date: "08.10.2025, 09:20",
      status: "new",
      isSystem: true,
      details: {
        property: {
          address: "наб. реки Мойки, 45",
          price: "5 800 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
        },
        buyer: {
          name: "Дмитрий Орлов",
          budget: "7 500 000 ₽"
        }
      }
    },
    {
      id: "sys-3",
      type: "system-showing-done",
      agent: { name: "Система MLS", avatar: "", company: "", hasMedal: false },
      description: "Прошло три дня. Состоялся ли показ у покупателя Сергей Ким по объекту на ул. Невский пр., 100? Отметьте результат.",
      potential: "6 200 000 ₽",
      date: "08.10.2025, 16:00",
      status: "new",
      isSystem: true,
      details: {
        property: {
          address: "ул. Невский проспект, 100",
          price: "6 200 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      }
    },
    {
      id: "sys-4",
      type: "system-commission-check",
      agent: { name: "Система MLS", avatar: "", company: "", hasMedal: false },
      description: "Вы обсуждались с агентом по объекту на ул. Литейный, 56. Удалось ли договориться с комиссией?",
      potential: "12 000 000 ���",
      date: "07.10.2025, 17:00",
      status: "new",
      isSystem: true,
      details: {
        property: {
          address: "ул. Литейный проспект, 56",
          price: "6 500 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      }
    },
    {
      id: "sys-5",
      type: "system-update-request",
      agent: { name: "Система MLS", avatar: "", company: "", hasMedal: false },
      description: "Заявка клиента Сергей Ким не обновлялась более 30 дней. Проверьте актуальность.",
      potential: "",
      date: "07.10.2025, 14:10",
      status: "new",
      isSystem: true,
      details: {
        buyer: {
          name: "Сергей Ким",
          budget: "6 000 000 ₽"
        }
      }
    }
  ];

  const tasks: Task[] = [
    {
      id: "1",
      type: "commission",
      agent: {
        name: "Фивейская Олеся",
        avatar: imgEllipse68,
        company: "Агент недвижимости",
        hasMedal: true
      },
      description: "Вы обсудились с агентом по объекту на ул. Литейный, 56. Удалось ли договориться с комиссией? 50/50 по объекту по городу.",
      potential: "6 200 000 ₽",
      date: "18.10.2025, 14:30",
      status: "new",
      details: {
        property: {
          address: "ул. Невский проспект, 100",
          price: "6 200 000 ₽",
          imageUrl: "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        proposal: "Комиссия 50/50"
      }
    },
    {
      id: "2",
      type: "showing",
      agent: {
        name: "Ривайская Олеся",
        avatar: imgEllipse68,
        company: "ОКНО ПАДАЮЩНОСТИ",
        hasMedal: false
      },
      description: "Предложение о совместной работе по объекту ул. Невский проспект, 100. Предлагает назначить показ. + объект",
      potential: "18 900 000 ₽",
      date: "07.10.2025, 10:15",
      status: "new",
      details: {}
    },
    {
      id: "3",
      type: "confirmation",
      agent: {
        name: "Яндекс Смирнов",
        avatar: "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "АГЕНТ НЕДВИЖИМОСТИ",
        hasMedal: false
      },
      description: "Попытаемся возобновить 10.10.2025. Подтверждения, что пары актуальна. + 15:00",
      potential: "8 500 000 ₽",
      date: "07.10.2025, 15:30",
      status: "new",
      details: {}
    },
    {
      id: "4",
      type: "other",
      agent: {
        name: "Беленова Юлиана",
        avatar: "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ПРЕДИНИМ КИВАТИ",
        hasMedal: false
      },
      description: "Прошло 30/31/31/27 ур. Напишите, ограничивая покупатели. + объект",
      potential: "4 500 000 ₽",
      date: "06.10.2025, 16:45",
      status: "in-progress",
      details: {}
    },
    {
      id: "5",
      type: "showing",
      agent: {
        name: "Мария Иванова",
        avatar: "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "АГЕНТ НЕДВИЖИМОСТИ",
        hasMedal: false
      },
      description: "Назначено на 10.10.2025 показа на 10.10.2024 в 15:00",
      potential: "",
      date: "06.10.2025, 12:00",
      status: "completed",
      details: {}
    }
  ];

  // Фильтрация задач
  const allTasks = [...systemTasks.filter(t => !hiddenSystemTasks.includes(t.id)), ...tasks];
  const filteredTasks = allTasks.filter(task => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    
    // Фильтрация по типу
    let matchesType = true;
    if (typeFilter === "system") {
      matchesType = task.isSystem === true;
    } else if (typeFilter === "commission") {
      matchesType = task.type === "commission";
    } else if (typeFilter === "showing") {
      matchesType = task.type === "showing";
    } else if (typeFilter === "confirmation") {
      matchesType = task.type === "confirmation";
    } else if (typeFilter === "other") {
      matchesType = task.type === "other";
    }
    
    const matchesSearch = searchQuery === "" || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.agent.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesType && matchesSearch;
  });

  const allTasksToDisplay = filteredTasks;
  const activeTasksCount = allTasks.filter(t => t.status !== "completed" && t.status !== "cancelled").length;

  const getStatusCount = (status: string) => {
    if (status === "all") return allTasks.length;
    return allTasks.filter(t => t.status === status).length;
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels = {
      new: "Новые",
      "in-progress": "В работе",
      completed: "Выполненные",
      cancelled: "Отменённые"
    };
    return labels[status] || status;
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log("Task action:", taskId, action);
    
    const task = allTasks.find(t => t.id === taskId);
    if (task && action === "message" && onOpenChat) {
      onOpenChat(task);
    }
  };

  const handleHideSystemTask = (taskId: string) => {
    setHiddenSystemTasks([...hiddenSystemTasks, taskId]);
  };

  const toggleExpandTask = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col" data-name="Задачи v3 v2">
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
              Задачи v3 (Стакан) v2
            </p>
          </div>
        </div>

        {/* Правая часть - фильтры и действия */}
        <div className="content-stretch flex gap-[24px] h-[56px] items-center relative shrink-0">
          {/* Поиск */}
          <div className="relative w-[240px]">
            <Input
              type="text"
              placeholder="Поиск по агенту или объекту..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Фильтр по типу */}
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[220px] bg-white border-gray-200">
              <SelectValue placeholder="Тип задачи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="system">Системные уведомления</SelectItem>
              <SelectItem value="commission">Деление комиссии</SelectItem>
              <SelectItem value="showing">Назначение показа</SelectItem>
              <SelectItem value="confirmation">Подтверждение пары</SelectItem>
              <SelectItem value="other">Прочее</SelectItem>
            </SelectContent>
          </Select>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setShowNotificationsModal(true)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                    notificationsEnabled 
                      ? "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100" 
                      : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {notificationsEnabled ? <Bell className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
                  <span className="text-[13px]">Уведомления</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Настроить уведомления</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Основной контент - двухколоночный layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Левая панель - навигация по статусам */}
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900 mb-1">Статусы</h3>
            <p className="text-gray-600 text-[13px]">{activeTasksCount} активных задач</p>
          </div>

          <div className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                statusFilter === "all" 
                  ? "bg-[#EAF4FF] text-[#2D9CDB]" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">Все задачи</span>
              <span className={`text-[13px] px-2 py-0.5 rounded-full ${
                statusFilter === "all" ? "bg-[#2D9CDB] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {getStatusCount("all")}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("new")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                statusFilter === "new" 
                  ? "bg-[#EAF4FF] text-[#2D9CDB]" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">Новые</span>
              <span className={`text-[13px] px-2 py-0.5 rounded-full ${
                statusFilter === "new" ? "bg-[#2D9CDB] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {getStatusCount("new")}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("in-progress")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                statusFilter === "in-progress" 
                  ? "bg-[#EAF4FF] text-[#2D9CDB]" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">В работе</span>
              <span className={`text-[13px] px-2 py-0.5 rounded-full ${
                statusFilter === "in-progress" ? "bg-[#2D9CDB] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {getStatusCount("in-progress")}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("completed")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                statusFilter === "completed" 
                  ? "bg-[#EAF4FF] text-[#2D9CDB]" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">Выполненные</span>
              <span className={`text-[13px] px-2 py-0.5 rounded-full ${
                statusFilter === "completed" ? "bg-[#2D9CDB] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {getStatusCount("completed")}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter("cancelled")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                statusFilter === "cancelled" 
                  ? "bg-[#EAF4FF] text-[#2D9CDB]" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">Отменённые</span>
              <span className={`text-[13px] px-2 py-0.5 rounded-full ${
                statusFilter === "cancelled" ? "bg-[#2D9CDB] text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {getStatusCount("cancelled")}
              </span>
            </button>
          </div>
        </div>

        {/* Правая часть - список задач (стакан) с выровненными элементами */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Заголовок списка */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">
              Задачи — {statusFilter === "all" ? "Все" : getStatusLabel(statusFilter as TaskStatus)} ({allTasksToDisplay.length})
            </h2>
          </div>

          {/* Список задач */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-3">
              {allTasksToDisplay.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => toggleExpandTask(task.id)}
                >
                  {/* Основное содержимое - выровненная сетка */}
                  <div className="grid grid-cols-[160px_1fr_120px_140px_auto] gap-4 items-center p-4">
                    {/* Агент - фиксированная ширина 160px */}
                    <div className="flex items-center gap-2 w-[160px]">
                      {task.isSystem ? (
                        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                          <Settings className="w-4 h-4 text-gray-600" />
                        </div>
                      ) : (
                        <img src={task.agent.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-1">
                          <span className={`text-[13px] truncate ${task.isSystem ? "text-[#8A8A8A]" : "text-gray-900"}`}>
                            {task.isSystem ? task.agent.name : `${task.agent.name.split(" ")[0]} ${task.agent.name.split(" ")[1]}`}
                          </span>
                          {!task.isSystem && task.agent.hasMedal && <Award className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                        </div>
                        {!task.isSystem && <span className="text-[11px] text-gray-500 truncate">{task.agent.company}</span>}
                      </div>
                    </div>

                    {/* Описание - растягивается */}
                    <div className="min-w-0">
                      <p className="text-[14px] text-gray-700 truncate">{task.description}</p>
                    </div>

                    {/* Потенциал - фиксированная ширина 120px */}
                    <div className="w-[120px] text-right">
                      {task.potential && (
                        <span className="text-[14px] text-green-700 font-semibold">{task.potential}</span>
                      )}
                    </div>

                    {/* Дата - фиксированная ширина 140px */}
                    <div className="w-[140px] flex items-center gap-1 text-gray-500 text-[12px]">
                      <Calendar className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{task.date}</span>
                    </div>

                    {/* Кнопки действий */}
                    <div className="flex items-center gap-1 justify-end">
                      {task.isSystem ? (
                        <>
                          {(task.type === "system-new-pair" || task.type === "system-new-object") && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "message");
                                }}
                                className="bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-3 py-1 h-7"
                              >
                                Написать
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleHideSystemTask(task.id);
                                }}
                                variant="ghost"
                                className="text-gray-600 hover:text-gray-900 text-[11px] px-3 py-1 h-7"
                              >
                                Скрыть
                              </Button>
                            </>
                          )}
                          {task.type === "system-showing-done" && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "showing-done");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-3 py-1 h-7 whitespace-nowrap"
                              >
                                Показ состоялся
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "showing-failed");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white text-[11px] px-3 py-1 h-7 whitespace-nowrap"
                              >
                                Не состоялся
                              </Button>
                            </>
                          )}
                          {task.type === "system-commission-check" && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "commission-agreed");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-3 py-1 h-7 whitespace-nowrap"
                              >
                                Да, согласовали
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "commission-not-agreed");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white text-[11px] px-3 py-1 h-7"
                              >
                                Нет
                              </Button>
                            </>
                          )}
                          {task.type === "system-update-request" && (
                            <>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "buyer-actual");
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-3 py-1 h-7"
                              >
                                Актуальна
                              </Button>
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "buyer-not-actual");
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white text-[11px] px-3 py-1 h-7 whitespace-nowrap"
                              >
                                Не актуальна
                              </Button>
                            </>
                          )}
                        </>
                      ) : task.type === "commission" && task.status !== "completed" && (
                        <>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "accept");
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-3 py-1 h-7"
                          >
                            Согласиться
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "discuss");
                            }}
                            className="bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-3 py-1 h-7"
                          >
                            Обсудить
                          </Button>
                        </>
                      )}
                      {task.type === "showing" && task.status !== "completed" && (
                        <>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "accept");
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-3 py-1 h-7"
                          >
                            Принять
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "change");
                            }}
                            className="bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-3 py-1 h-7"
                          >
                            Изменить
                          </Button>
                        </>
                      )}
                      {task.type === "confirmation" && task.status !== "completed" && (
                        <>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "confirm");
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white text-[11px] px-3 py-1 h-7"
                          >
                            Подтвердить
                          </Button>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "not-interested");
                            }}
                            className="bg-gray-500 hover:bg-gray-600 text-white text-[11px] px-3 py-1 h-7"
                          >
                            Неинтересно
                          </Button>
                        </>
                      )}
                      {task.type === "other" && task.status !== "completed" && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTask(task);
                          }}
                          className="bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-3 py-1 h-7"
                        >
                          Посмотреть
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Модалка детали задачи */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
        />
      )}

      {/* Модалка настроек уведомлений */}
      <NotificationsSettingsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
        onSave={(enabled) => {
          setNotificationsEnabled(enabled);
          setShowNotificationsModal(false);
        }}
      />
    </div>
  );
}
