import { useMemo, useState } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import { Button } from "./ui/button";
import {
  Archive,
  ArrowLeft,
  Award,
  FileText,
  MessageCircle,
  MessageCircleMore,
  Search,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type TaskType = "new-chat" | "terms-fixing";
type TaskDirection = "incoming" | "outgoing";
type TaskStatus =
  | "awaiting-terms-approval"
  | "terms-approved"
  | "rejected"
  | "ignored";

interface Task {
  id: string;
  type: TaskType;
  direction: TaskDirection;
  agent: {
    name: string;
    avatar: string;
    company: string;
    hasMedal: boolean;
  };
  description: string;
  potential: string;
  date: string;
  status?: TaskStatus;
  statusHint?: string;
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

interface TasksViewV3Props {
  onBack?: () => void;
  onOpenChat?: (task: Task, action?: string) => void;
  hideAllTasksNavigation?: boolean;
  hidePotentialPairs?: boolean;
}

function IconMenu() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 40 40"
      >
        <rect fill="#318BFF" height="40" rx="8" width="40" />
        <path
          d="M12 14h16M12 20h16M12 26h10"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function IconStreaming() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path d={svgPaths.p4127880} fill="var(--fill-0, white)" />
      </svg>
    </div>
  );
}

function IconChat() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path
          clipRule="evenodd"
          d={svgPaths.p28356580}
          fill="var(--fill-0, #318BFF)"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

function IconPhone() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path d={svgPaths.p1c59e800} fill="var(--fill-0, #318BFF)" />
      </svg>
    </div>
  );
}

function IconSearch() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <path d={svgPaths.p1fd693f0} fill="var(--fill-0, #318BFF)" />
        <path
          clipRule="evenodd"
          d={svgPaths.pd757500}
          fill="var(--fill-0, #318BFF)"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
}

function IconBill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-0 overflow-clip">
        <div className="absolute h-[19px] left-[calc(50%+0.341px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[16.683px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 17 19"
          >
            <path
              clipRule="evenodd"
              d={svgPaths.p19868900}
              fill="var(--fill-0, #318BFF)"
              fillRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

const INITIAL_TASKS: Task[] = [
  {
    id: "terms-awaiting-1",
    type: "terms-fixing",
    direction: "incoming",
    agent: {
      name: "Андрей Смирнов",
      avatar:
        "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      company: "ЭЛИТ НЕДВИЖИМОСТЬ",
      hasMedal: false,
    },
    description: "Требуется согласование условий комиссии по объекту на наб. Мойки",
    potential: "5 800 000 ₽",
    date: "13.10.2025, 11:20",
    status: "awaiting-terms-approval",
    details: {
      property: {
        address: "наб. реки Мойки, 45",
        price: "5 800 000 ₽",
        imageUrl:
          "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      buyer: { name: "Дмитрий Орлов", budget: "7 500 000 ₽" },
      proposal: "Предлагаю деление комиссии 50/50. Клиент готов к сделке.",
    },
  },
  {
    id: "terms-approved-1",
    type: "terms-fixing",
    direction: "outgoing",
    agent: {
      name: "Мария Иванова",
      avatar:
        "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      company: "НЕДВИЖИМОСТЬ ПЛЮС",
      hasMedal: false,
    },
    description: "Условия комиссии согласованы по объекту на ул. Литейной",
    potential: "4 500 000 ₽",
    date: "13.10.2025, 12:00",
    status: "terms-approved",
    details: {
      property: {
        address: "ул. Литейная, 56",
        price: "4 500 000 ₽",
        imageUrl:
          "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      buyer: { name: "Алексей Петров", budget: "4 800 000 ₽" },
    },
  },
  {
    id: "terms-rejected-1",
    type: "terms-fixing",
    direction: "incoming",
    agent: {
      name: "Екатерина Волкова",
      avatar:
        "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
      company: "ПРЕМИУМ РИЭЛТИ",
      hasMedal: true,
    },
    description: "Предложение комиссии отклонено по объекту на Невском проспекте",
    potential: "7 900 000 ₽",
    date: "12.10.2025, 16:15",
    status: "rejected",
    details: {
      property: {
        address: "Невский проспект, 100",
        price: "7 900 000 ₽",
        imageUrl:
          "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080",
      },
      buyer: { name: "Михаил Сидоров", budget: "8 000 000 ₽" },
    },
  },
  {
    id: "terms-ignored-1",
    type: "terms-fixing",
    direction: "outgoing",
    agent: {
      name: "Иван Соколов",
      avatar:
        "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGF2YXRhcnxlbnwxfHx8fDE3NTk1NDc5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      company: "ГОРОДСКАЯ НЕДВИЖИМОСТЬ",
      hasMedal: true,
    },
    description: "Предложение комиссии не получило ответа",
    potential: "9 200 000 ₽",
    date: "10.10.2025, 15:30",
    status: "ignored",
    statusHint: "Срок действия предложения истёк",
    details: {
      property: {
        address: "пр. Ветеранов, 78",
        price: "9 200 000 ₽",
        imageUrl:
          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnR8ZW58MHx8fHwxNzU5NTY1MDc0fDA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      buyer: { name: "Ольга Петрова", budget: "9 500 000 ₽" },
    },
  },
  {
    id: "new-chat-1",
    type: "new-chat",
    direction: "incoming",
    agent: {
      name: "Фивейская Олеся Олеговна",
      avatar:
        "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      company: "МИР КВАРТИР",
      hasMedal: true,
    },
    description: "Новое сообщение по объекту на Невском проспекте",
    potential: "6 200 000 ₽",
    date: "13.10.2025, 14:30",
    details: {
      property: {
        address: "Невский проспект, 100",
        price: "6 200 000 ₽",
        imageUrl:
          "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      },
      buyer: { name: "Сергей Ким", budget: "6 000 000 ₽" },
      proposal:
        "Здравствуйте! Мой клиент интересуется вашим объектом. Можем обсудить условия сотрудничества?",
    },
  },
];

export function TasksViewV3({
  onBack,
  onOpenChat,
  hideAllTasksNavigation,
  hidePotentialPairs,
}: TasksViewV3Props) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [statusFilter, setStatusFilter] = useState<string>("mls-all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (statusFilter === "mls-new-chat" && task.type !== "new-chat") return false;
      if (statusFilter === "mls-terms" && task.type !== "terms-fixing") return false;
      if (typeFilter !== "all" && task.type !== typeFilter) return false;

      if (
        searchQuery &&
        !task.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !task.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [tasks, statusFilter, typeFilter, searchQuery]);

  const getStatusCount = (filter: string) => {
    if (filter === "mls-all") return tasks.length;
    if (filter === "mls-new-chat")
      return tasks.filter((task) => task.type === "new-chat").length;
    if (filter === "mls-terms")
      return tasks.filter((task) => task.type === "terms-fixing").length;
    return 0;
  };

  const getTaskTypeLabel = (type: TaskType) => {
    const labels: Record<TaskType, string> = {
      "new-chat": "Новый чат",
      "terms-fixing": "Фиксация условий",
    };
    return labels[type];
  };

  const getTaskTypeIcon = (type: TaskType) => {
    const icons: Record<TaskType, JSX.Element> = {
      "new-chat": <MessageCircle className="w-5 h-5" />,
      "terms-fixing": <FileText className="w-5 h-5" />,
    };
    return icons[type];
  };

  const getStatusLabel = (status?: TaskStatus) => {
    if (!status) return "";
    const labels: Record<TaskStatus, string> = {
      "awaiting-terms-approval": "Ожидает согласования условий",
      "terms-approved": "Условия согласованы",
      rejected: "Отклонено",
      ignored: "Проигнорировано",
    };
    return labels[status];
  };

  const getStatusClassName = (status?: TaskStatus) => {
    if (!status) return "";
    const classes: Record<TaskStatus, string> = {
      "awaiting-terms-approval": "bg-yellow-100 text-yellow-800",
      "terms-approved": "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      ignored: "bg-gray-200 text-gray-700",
    };
    return classes[status];
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus, statusHint?: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status,
              statusHint,
            }
          : task,
      ),
    );
  };

  const handleTaskAction = (taskId: string, action: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;

    if (action === "open-chat" && onOpenChat) {
      onOpenChat(task, action);
    }

    if (action === "accept-terms") {
      updateTaskStatus(taskId, "terms-approved");
    }
    if (action === "change-terms" || action === "send-new-offer" || action === "resend-offer") {
      updateTaskStatus(taskId, "awaiting-terms-approval");
    }
    if (action === "decline-terms") {
      updateTaskStatus(taskId, "rejected");
    }
  };

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      <div className="bg-white box-border content-stretch flex items-center justify-between overflow-clip pl-0 pr-[20px] py-0 relative shadow-[0px_4px_10px_0px_rgba(0,0,0,0.06)] shrink-0 w-full">
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
              Работа по МЛС
            </p>
          </div>
        </div>

        <div className="content-stretch flex gap-[24px] h-[56px] items-center relative shrink-0">
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

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[220px] bg-white border-gray-200">
              <SelectValue placeholder="Тип взаимодействия" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              <SelectItem value="new-chat">Новый чат</SelectItem>
              <SelectItem value="terms-fixing">Фиксация условий</SelectItem>
            </SelectContent>
          </Select>

          <div className="bg-[#fe3c3b] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0">
            <IconStreaming />
            <p className="font-semibold leading-[22px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
              Live
            </p>
          </div>
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
            <IconChat />
            <IconPhone />
            <IconSearch />
            <IconBill />
          </div>
          <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
            <div className="[grid-area:1_/_1] ml-[3px] mt-[3px] relative size-[40px]">
              <img
                alt=""
                className="block max-w-none size-full"
                height="40"
                src={imgEllipse68}
                width="40"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          {!hideAllTasksNavigation && (
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="text-gray-900">Работа по МЛС</h3>
            </div>
          )}

          <div>
            <div className="px-2 pb-4 space-y-1 pt-4">
              <button
                onClick={() => setStatusFilter("mls-all")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  statusFilter === "mls-all"
                    ? "bg-[#EAF4FF] text-[#2D9CDB]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Archive className="w-4 h-4" />
                  <span className="font-medium">Все</span>
                </div>
                <span
                  className={`text-[12px] px-2 py-0.5 rounded-full ${
                    statusFilter === "mls-all"
                      ? "bg-[#2D9CDB] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("mls-all")}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("mls-new-chat")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  statusFilter === "mls-new-chat"
                    ? "bg-[#EAF4FF] text-[#2D9CDB]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageCircleMore className="w-4 h-4" />
                  <span className="font-medium">Новый чат</span>
                </div>
                <span
                  className={`text-[12px] px-2 py-0.5 rounded-full ${
                    statusFilter === "mls-new-chat"
                      ? "bg-[#2D9CDB] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("mls-new-chat")}
                </span>
              </button>

              <button
                onClick={() => setStatusFilter("mls-terms")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  statusFilter === "mls-terms"
                    ? "bg-[#EAF4FF] text-[#2D9CDB]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span className="font-medium">Фиксация условий</span>
                </div>
                <span
                  className={`text-[12px] px-2 py-0.5 rounded-full ${
                    statusFilter === "mls-terms"
                      ? "bg-[#2D9CDB] text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount("mls-terms")}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-baseline justify-between">
            <h2 className="text-gray-900">Работа по МЛС ({filteredTasks.length})</h2>

            {!hidePotentialPairs && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="px-3 py-2 bg-[#E8F4FF] rounded-lg">
                      <span className="font-semibold text-[#007AFF] text-sm">
                        Потенциал пар — 350 000 ₽
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Сумма возможной комиссии по всем активным парам</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-3">
              {filteredTasks.map((task, index) => {
                const showCommissionStatus = task.type === "terms-fixing" && !!task.status;

                return (
                  <div key={task.id}>
                    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          {getTaskTypeIcon(task.type)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">
                                  {getTaskTypeLabel(task.type)}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  {task.direction === "outgoing"
                                    ? "Исходящее"
                                    : "Входящее"}
                                </span>
                              </div>
                              <h3 className="text-gray-900">{task.description}</h3>
                            </div>
                            {showCommissionStatus && (
                              <div className="text-right">
                                <Badge className={getStatusClassName(task.status)}>
                                  {getStatusLabel(task.status)}
                                </Badge>
                                {task.statusHint && (
                                  <p className="text-[11px] text-gray-500 mt-1">
                                    {task.statusHint}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-[11px] text-gray-500 mb-1">Контрагент</p>
                              <div className="flex items-center gap-2 text-gray-700">
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                                  <ImageWithFallback
                                    src={task.agent.avatar}
                                    alt={task.agent.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span>{task.agent.name}</span>
                                {task.agent.hasMedal && (
                                  <Award className="w-3.5 h-3.5 text-blue-600" />
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-[11px] text-gray-500 mb-1">Последнее действие</p>
                              <p className="text-gray-700">{task.date}</p>
                            </div>
                            <div>
                              <p className="text-[11px] text-gray-500 mb-1">Цена</p>
                              <p className="text-blue-600">{task.potential}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                          onClick={() => handleTaskAction(task.id, "open-chat")}
                        >
                          Открыть чат
                        </Button>

                        {task.type === "terms-fixing" &&
                          task.status === "awaiting-terms-approval" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-[#43A047] hover:bg-[#388E3C] text-white"
                                onClick={() => handleTaskAction(task.id, "accept-terms")}
                              >
                                Принять условия
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50"
                                onClick={() => handleTaskAction(task.id, "decline-terms")}
                              >
                                Отклонить
                              </Button>
                            </>
                          )}

                        {task.type === "terms-fixing" &&
                          task.status === "terms-approved" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-amber-300 text-amber-800 hover:bg-amber-50"
                                onClick={() => handleTaskAction(task.id, "change-terms")}
                              >
                                Изменить условия
                              </Button>
                              <span className="text-[11px] text-amber-700">
                                После нажатия статус вернется в "Ожидает согласования условий"
                              </span>
                            </>
                          )}

                        {task.type === "terms-fixing" && task.status === "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => handleTaskAction(task.id, "send-new-offer")}
                          >
                            Отправить новое предложение
                          </Button>
                        )}

                        {task.type === "terms-fixing" && task.status === "ignored" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                            onClick={() => handleTaskAction(task.id, "resend-offer")}
                          >
                            Отправить повторно
                          </Button>
                        )}
                      </div>
                    </div>

                    {index < filteredTasks.length - 1 && <div className="h-px bg-gray-200 my-3" />}
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Нет взаимодействий для отображения</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
