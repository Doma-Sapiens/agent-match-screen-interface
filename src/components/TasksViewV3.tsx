import { useEffect, useMemo, useState } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import { Button } from "./ui/button";
import {
  Award,
  Calendar,
  DollarSign,
  User,
  ArrowLeft,
  Search,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  MessageCircle,
  Bell,
  Settings,
  X,
  Eye,
  EyeOff,
  FileText,
  Handshake,
  CheckCircle,
  Archive,
  MessageCircleMore,
  MapPin,
  CircleDollarSign,
  FileCheck,
  TrendingUp,
  Sparkles,
} from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface TasksViewV3Props {
  onBack?: () => void;
  onOpenChat?: (task: Task, action?: string) => void;
  hideAllTasksNavigation?: boolean;
  hidePotentialPairs?: boolean;
}

function IconMenu() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="icon-menu/задачи">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 40 40"
      >
        <g id="icon-menu/задачи">
          <rect fill="#318BFF" height="40" rx="8" width="40" />
          <path
            d="M12 14h16M12 20h16M12 26h10"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
}

function IconStreaming() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/streaming">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
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
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="icon/chat">
          <path
            clipRule="evenodd"
            d={svgPaths.p28356580}
            fill="var(--fill-0, #318BFF)"
            fillRule="evenodd"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function IconPhone() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/phone">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="icon/phone">
          <path
            d={svgPaths.p1c59e800}
            fill="var(--fill-0, #318BFF)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function IconSearch() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="icon/search">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        <g id="icon/search">
          <g id="Vector">
            <path d={svgPaths.p1fd693f0} fill="var(--fill-0, #318BFF)" />
            <path
              clipRule="evenodd"
              d={svgPaths.pd757500}
              fill="var(--fill-0, #318BFF)"
              fillRule="evenodd"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconBill() {
  return (
    <div
      className="overflow-clip relative shrink-0 size-[24px]"
      data-name="icon/bill-1"
    >
      <div className="absolute inset-0 overflow-clip" data-name="Frame">
        <div
          className="absolute h-[19px] left-[calc(50%+0.341px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[16.683px]"
          data-name="Vector"
        >
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
              id="Vector"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

type TaskType =
  | "new-chat"
  | "terms-fixing"
  | "showing-schedule"
  | "deposit-ready"
  | "deal-closed"
  | "commission-received";
type TaskStatus =
  | "awaiting-response"
  | "transferred-to-mss"
  | "awaiting-actions"
  | "completed";

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

export function TasksViewV3({
  onBack,
  onOpenChat,
  hideAllTasksNavigation,
  hidePotentialPairs,
}: TasksViewV3Props) {
  const rub = useMemo(
    () => new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }),
    [],
  );

  const [showCommissionSplitModal, setShowCommissionSplitModal] =
    useState(false);
  const [commissionSplitTaskId, setCommissionSplitTaskId] = useState<
    string | null
  >(null);

  // Draft values for modal (temporary hardcoded as requested)
  const myConditionsRub = 30000;
  const partnerConditionsRub = 60000;

  const [totalCommissionRub, setTotalCommissionRub] = useState<string>("90000");
  const [mySharePercent, setMySharePercent] = useState<string>("50");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const AI_ASSISTANT_SETTINGS_KEY = "agent-match.aiAssistantSettings.v1";

  type AiAssistantMode = "start" | "reply";
  type AiAssistantSettings = {
    mode: AiAssistantMode;
    autoReplyAfterHours: string; // 0..99, string for input
  };

  const loadAiAssistantSettings = (): AiAssistantSettings => {
    try {
      const raw = localStorage.getItem(AI_ASSISTANT_SETTINGS_KEY);
      if (!raw) {
        return { mode: "start", autoReplyAfterHours: "" };
      }
      const parsed = JSON.parse(raw) as Partial<AiAssistantSettings>;
      const mode: AiAssistantMode =
        parsed.mode === "reply" ? "reply" : "start";
      const hours = String(parsed.autoReplyAfterHours ?? "").replace(
        /[^0-9]/g,
        "",
      );
      return { mode, autoReplyAfterHours: hours.slice(0, 2) };
    } catch {
      return { mode: "start", autoReplyAfterHours: "" };
    }
  };

  const saveAiAssistantSettings = (s: AiAssistantSettings) => {
    localStorage.setItem(AI_ASSISTANT_SETTINGS_KEY, JSON.stringify(s));
  };

  const [showAIAssistantModal, setShowAIAssistantModal] = useState(false);
  const [aiAssistantSettings, setAiAssistantSettings] =
    useState<AiAssistantSettings>({ mode: "start", autoReplyAfterHours: "" });
  const [aiAssistantDraft, setAiAssistantDraft] = useState<AiAssistantSettings>(
    { mode: "start", autoReplyAfterHours: "" },
  );

  useEffect(() => {
    // Load saved settings on first render
    const loaded = loadAiAssistantSettings();
    setAiAssistantSettings(loaded);
    setAiAssistantDraft(loaded);
  }, []);

  const [mlsDirection, setMlsDirection] = useState<"incoming" | "outgoing">(
    "incoming",
  );
  const [isMlsExpanded, setIsMlsExpanded] = useState(true);
  const [actionsClicked, setActionsClicked] = useState<
    Record<string, string[]>
  >({});

  const int = (value: string | number | null | undefined): number => {
    const raw = String(value ?? "").trim();
    const n = parseInt(raw || "0", 10);
    return Number.isFinite(n) ? n : 0;
  };

  // Входящие задачи
  const incomingTasks: Task[] = [
    {
      id: "task-1",
      type: "new-chat",
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
      status: "awaiting-response",
      details: {
        property: {
          address: "ул. Невский проспект, 100",
          price: "6 200 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Сергей Ким",
          budget: "6 000 000 ₽",
        },
        proposal:
          "Здравствуйте! Мой клиент интересуется вашим объектом. Можем обсудить условия сотрудничества?",
      },
    },
    {
      id: "task-2",
      type: "terms-fixing",
      agent: {
        name: "Андрей Смирнов",
        avatar:
          "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ЭЛИТ НЕДВИЖИМОСТЬ",
        hasMedal: false,
      },
      description:
        "Требуется согласование условий комиссии по объекту на наб. Мойки",
      potential: "5 800 000 ₽",
      date: "13.10.2025, 11:20",
      status: "awaiting-response",
      details: {
        property: {
          address: "наб. реки Мойки, 45",
          price: "5 800 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Дмитрий Орлов",
          budget: "7 500 000 ₽",
        },
        proposal: "Предлагаю деление комиссии 50/50. Клиент готов к сделке.",
      },
    },
    {
      id: "task-3",
      type: "showing-schedule",
      agent: {
        name: "Екатерина Волкова",
        avatar:
          "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ПРЕМИУМ РИЭЛТИ",
        hasMedal: true,
      },
      description: "Нужно согласовать время показа объекта на ул. Рубинштейна",
      potential: "7 900 000 ₽",
      date: "12.10.2025, 16:15",
      status: "awaiting-response",
      details: {
        property: {
          address: "ул. Рубинштейна, 23",
          price: "7 900 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Михаил Сидоров",
          budget: "8 000 000 ₽",
        },
        proposal:
          "Клиент готов посмотреть объект 15 октября в 14:00. Подходит ли вам это время?",
      },
    },
    {
      id: "task-4",
      type: "deposit-ready",
      agent: {
        name: "Мария Иванова",
        avatar:
          "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "НЕДВИЖИМОСТЬ ПЛЮС",
        hasMedal: false,
      },
      description: "Покупатель готов внести задаток по объекту на ул. Литейный",
      potential: "4 500 000 ₽",
      date: "11.10.2025, 10:00",
      status: "transferred-to-mss",
      details: {
        property: {
          address: "ул. Литейный, 56",
          price: "4 500 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Алексей Петров",
          budget: "4 800 000 ₽",
        },
      },
    },
    {
      id: "task-5",
      type: "deal-closed",
      agent: {
        name: "Иван Соколов",
        avatar:
          "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ГОРОДСКАЯ НЕДВИЖИМОСТЬ",
        hasMedal: true,
      },
      description:
        "Сделка по объекту на пр. Ветеранов завершена. Ожидается получение КВ",
      potential: "9 200 000 ₽",
      date: "10.10.2025, 15:30",
      status: "awaiting-actions",
      details: {
        property: {
          address: "пр. Ветеранов, 78",
          price: "9 200 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Ольга Петрова",
          budget: "9 500 000 ₽",
        },
      },
    },
    {
      id: "task-6",
      type: "commission-received",
      agent: {
        name: "Анна Белова",
        avatar:
          "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
        company: "СТОЛИЦА НЕДВИЖИМОСТЬ",
        hasMedal: false,
      },
      description: "Комиссия по сделке на ул. Гороховая получена",
      potential: "3 800 000 ₽",
      date: "08.10.2025, 12:00",
      status: "completed",
      details: {
        property: {
          address: "ул. Гороховая, 12",
          price: "3 800 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Павел Морозов",
          budget: "4 000 000 ₽",
        },
      },
    },
  ];

  // Исходящие задачи (пока копия входящих)
  const outgoingTasks: Task[] = [
    {
      id: "task-out-1",
      type: "new-chat",
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
      status: "awaiting-response",
      details: {
        property: {
          address: "ул. Невский проспект, 100",
          price: "6 200 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Сергей Ким",
          budget: "6 000 000 ₽",
        },
        proposal:
          "Здравствуйте! Мой клиент интересуется вашим объектом. Можем обсудить условия сотрудничества?",
      },
    },
    {
      id: "task-out-2",
      type: "terms-fixing",
      agent: {
        name: "Андрей Смирнов",
        avatar:
          "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ЭЛИТ НЕДВИЖИМОСТЬ",
        hasMedal: false,
      },
      description:
        "Требуется согласование условий комиссии по объекту на наб. Мойки",
      potential: "5 800 000 ₽",
      date: "13.10.2025, 11:20",
      status: "awaiting-response",
      details: {
        property: {
          address: "наб. реки Мойки, 45",
          price: "5 800 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Дмитрий Орлов",
          budget: "7 500 000 ₽",
        },
        proposal: "Предлагаю деление комиссии 50/50. Клиент готов к сделке.",
      },
    },
    {
      id: "task-out-3",
      type: "showing-schedule",
      agent: {
        name: "Екатерина Волкова",
        avatar:
          "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ПРЕМИУМ РИЭЛТИ",
        hasMedal: true,
      },
      description: "Нужно согласовать время показа объекта на ул. Рубинштейна",
      potential: "7 900 000 ₽",
      date: "12.10.2025, 16:15",
      status: "awaiting-response",
      details: {
        property: {
          address: "ул. Рубинштейна, 23",
          price: "7 900 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Михаил Сидоров",
          budget: "8 000 000 ₽",
        },
        proposal:
          "Клиент готов посмотреть объект 15 октября в 14:00. Подходит ли вам это время?",
      },
    },
    {
      id: "task-out-4",
      type: "deposit-ready",
      agent: {
        name: "Мария Иванова",
        avatar:
          "https://images.unsplash.com/photo-1736939681295-bb2e6759dddc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHdvbWFuJTIwYXZhdGFyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU5OTE3MTI1fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "НЕДВИЖИМОСТЬ ПЛЮС",
        hasMedal: false,
      },
      description: "Покупатель готов внести задаток по объекту на ул. Литейный",
      potential: "4 500 000 ₽",
      date: "11.10.2025, 10:00",
      status: "transferred-to-mss",
      details: {
        property: {
          address: "ул. Литейный, 56",
          price: "4 500 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1594873604892-b599f847e859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk1NjUwNzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Алексей Петров",
          budget: "4 800 000 ₽",
        },
      },
    },
    {
      id: "task-out-5",
      type: "deal-closed",
      agent: {
        name: "Иван Соколов",
        avatar:
          "https://images.unsplash.com/photo-1723537742563-15c3d351dbf2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMG1hbiUyMHBvcnRyYWl0JTIwaGVhZHNob3R8ZW58MXx8fHwxNzU5OTE3MTI5fDA&ixlib=rb-4.1.0&q=80&w=1080",
        company: "ГОРОДСКАЯ НЕДВИЖИМОСТЬ",
        hasMedal: true,
      },
      description:
        "Сделка по объекту на пр. Ветеранов завершена. Ожидается получение КВ",
      potential: "9 200 000 ₽",
      date: "10.10.2025, 15:30",
      status: "awaiting-actions",
      details: {
        property: {
          address: "пр. Ветеранов, 78",
          price: "9 200 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1687180498602-5a1046defaa4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwYXBhcnRtZW50fGVufDF8fHx8MTc1OTY5MjE2OXww&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Ольга Петрова",
          budget: "9 500 000 ₽",
        },
      },
    },
    {
      id: "task-out-6",
      type: "commission-received",
      agent: {
        name: "Анна Белова",
        avatar:
          "https://images.unsplash.com/photo-1758518727888-ffa196002e59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzc3dvbWFuJTIwc21pbGluZyUyMHBvcnRyYWl0fGVufDF8fHx8MTc1OTkxNzEzMnww&ixlib=rb-4.1.0&q=80&w=1080",
        company: "СТОЛИЦА НЕДВИЖИМОСТЬ",
        hasMedal: false,
      },
      description: "Комиссия по сделке на ул. Гороховая получена",
      potential: "3 800 000 ₽",
      date: "08.10.2025, 12:00",
      status: "completed",
      details: {
        property: {
          address: "ул. Гороховая, 12",
          price: "3 800 000 ₽",
          imageUrl:
            "https://images.unsplash.com/photo-1755624222023-621f7718950b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBraXRjaGVuJTIwaW50ZXJpb3IlMjBhcGFydG1lbnR8ZW58MXx8fHwxNzU5NjkyMTY2fDA&ixlib=rb-4.1.0&q=80&w=1080",
        },
        buyer: {
          name: "Павел Морозов",
          budget: "4 000 000 ₽",
        },
      },
    },
  ];

  // Выбираем задачи в зависимости от направления
  const tasks = mlsDirection === "incoming" ? incomingTasks : outgoingTasks;

  const filteredTasks = tasks.filter((task) => {
    // Фильтр по статусу из левого меню
    if (
      statusFilter === "today" ||
      statusFilter === "tomorrow" ||
      statusFilter === "week" ||
      statusFilter === "overdue"
    ) {
      return false; // Пока нет задач для этих фильтров
    }

    if (statusFilter === "completed" && task.status !== "completed")
      return false;
    if (statusFilter === "all" && task.status === "completed") return false; // "Новые" не включают выполненные

    // МЛС фильтры
    if (statusFilter === "mls-all") {
      // Показываем все МЛС задачи, кроме выполненных
      return task.status !== "completed";
    }
    if (statusFilter === "mls-new-chat" && task.type !== "new-chat")
      return false;
    if (statusFilter === "mls-terms" && task.type !== "terms-fixing")
      return false;
    if (statusFilter === "mls-showing" && task.type !== "showing-schedule")
      return false;
    if (statusFilter === "mls-deposit" && task.type !== "deposit-ready")
      return false;
    if (statusFilter === "mls-closed" && task.type !== "deal-closed")
      return false;
    if (
      statusFilter === "mls-commission-received" &&
      task.type !== "commission-received"
    )
      return false;

    // Фильтр по типу из верхнего селекта
    if (typeFilter !== "all" && task.type !== typeFilter) return false;

    // Поиск
    if (
      searchQuery &&
      !task.agent.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  const getTaskTypeLabel = (type: TaskType) => {
    const labels: Record<TaskType, string> = {
      "new-chat": "Новый чат",
      "terms-fixing": "Фиксация условий",
      "showing-schedule": "Назначение показа",
      "deposit-ready": "Готов вносить аванс/задаток",
      "deal-closed": "Сделка закрыта",
      "commission-received": "КВ получена",
    };
    return labels[type];
  };

  const getTaskTypeIcon = (type: TaskType) => {
    const icons: Record<TaskType, JSX.Element> = {
      "new-chat": <MessageCircle className="w-5 h-5" />,
      "terms-fixing": <FileText className="w-5 h-5" />,
      "showing-schedule": <Calendar className="w-5 h-5" />,
      "deposit-ready": <DollarSign className="w-5 h-5" />,
      "deal-closed": <Handshake className="w-5 h-5" />,
      "commission-received": <CheckCircle className="w-5 h-5" />,
    };
    return icons[type];
  };

  const getStatusLabel = (status: TaskStatus) => {
    const labels: Record<TaskStatus, string> = {
      "awaiting-response": "Ожидает ответа",
      "transferred-to-mss": "Передано в МСС",
      "awaiting-actions": "Ожидает действий",
      completed: "Выполнено",
    };
    return labels[status];
  };

  const getStatusCount = (filter: string) => {
    // Используем текущий набор задач (входящие или исходящие)
    const currentTasks =
      mlsDirection === "incoming" ? incomingTasks : outgoingTasks;

    if (filter === "all")
      return currentTasks.filter((t) => t.status !== "completed").length;
    if (filter === "completed")
      return currentTasks.filter((t) => t.status === "completed").length;
    if (
      filter === "today" ||
      filter === "tomorrow" ||
      filter === "week" ||
      filter === "overdue"
    )
      return 0;

    // МЛС фильтры
    if (filter === "mls-all")
      return currentTasks.filter((t) => t.status !== "completed").length;
    if (filter === "mls-new-chat")
      return currentTasks.filter((t) => t.type === "new-chat").length;
    if (filter === "mls-terms")
      return currentTasks.filter((t) => t.type === "terms-fixing").length;
    if (filter === "mls-showing")
      return currentTasks.filter((t) => t.type === "showing-schedule").length;
    if (filter === "mls-deposit")
      return currentTasks.filter((t) => t.type === "deposit-ready").length;
    if (filter === "mls-closed")
      return currentTasks.filter((t) => t.type === "deal-closed").length;
    if (filter === "mls-commission-received")
      return currentTasks.filter((t) => t.type === "commission-received")
        .length;

    return 0;
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log(`Задача ${taskId}: действие ${action}`);

    // Открываем модалку "Предложить деление комиссии" (для МЛС терминала)
    if (action === "propose-terms") {
      setCommissionSplitTaskId(taskId);
      setShowCommissionSplitModal(true);

      // reset defaults each open
      setTotalCommissionRub(String(myConditionsRub + partnerConditionsRub));
      setMySharePercent("50");
      return;
    }

    // Отмечаем действие как выполненное
    setActionsClicked((prev) => ({
      ...prev,
      [taskId]: [...(prev[taskId] || []), action],
    }));

    // Открываем чат для разных типов действий
    if (
      (action === "message" ||
        action === "open-chat" ||
        action === "accept-terms") &&
      onOpenChat
    ) {
      const allTasks = [...incomingTasks, ...outgoingTasks];
      const task = allTasks.find((t) => t.id === taskId);
      if (task) {
        onOpenChat(task, action);
      }
    }
  };

  const activeTasksCount = [...incomingTasks, ...outgoingTasks].filter(
    (t) => t.status !== "completed",
  ).length;

  return (
    <div
      className="bg-[#F9FAFB] min-h-screen flex flex-col"
      data-name="Задачи v3"
    >
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
              <SelectItem value="new-chat">Новый чат</SelectItem>
              <SelectItem value="terms-fixing">Фиксация условий</SelectItem>
              <SelectItem value="showing-schedule">
                Назначение показа
              </SelectItem>
              <SelectItem value="deposit-ready">
                Готов вносить аванс/задаток
              </SelectItem>
              <SelectItem value="deal-closed">Сделка закрыта</SelectItem>
              <SelectItem value="commission-received">КВ получена</SelectItem>
            </SelectContent>
          </Select>

          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white h-[36px] px-3"
            onClick={() => {
              setAiAssistantDraft(aiAssistantSettings);
              setShowAIAssistantModal(true);
            }}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            ИИ-ассистент
          </Button>

          <div className="bg-[#fe3c3b] box-border content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[4px] relative rounded-[20px] shrink-0">
            <IconStreaming />
            <p className="font-semibold leading-[22px] relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
              Live
            </p>
          </div>
          <div className="content-stretch flex gap-[24px] items-center relative shrink-0">
            <div className="relative shrink-0 size-[24px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 24 24"
              >
                <g id="Frame">
                  <g id="Vector">
                    <path
                      d={svgPaths.p3a07c600}
                      fill="var(--fill-0, #318BFF)"
                    />
                    <path
                      d={svgPaths.p24888500}
                      fill="var(--fill-0, #318BFF)"
                    />
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
              <img
                alt=""
                className="block max-w-none size-full"
                height="40"
                src={imgEllipse68}
                width="40"
              />
            </div>
            <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[46px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 46 46"
              >
                <circle
                  cx="23"
                  cy="23"
                  id="Ellipse 69"
                  r="22"
                  stroke="var(--stroke-0, #318BFF)"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Основной контент - двухколоночный layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Левая панель - навигация */}
        <div className="w-[280px] bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          {!hideAllTasksNavigation && (
            <>
              {/* Раздел "Все задачи" */}
              <div className="border-b border-gray-200">
                <div className="p-4 pb-2">
                  <h3 className="text-gray-900 mb-3">Все задачи</h3>
                </div>

                <div className="px-2 pb-4 space-y-1">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      statusFilter === "all"
                        ? "bg-[#EAF4FF] text-[#2D9CDB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">Новые</span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-full ${
                        statusFilter === "all"
                          ? "bg-[#2D9CDB] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {getStatusCount("all")}
                    </span>
                  </button>

                  <button
                    onClick={() => setStatusFilter("today")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      statusFilter === "today"
                        ? "bg-[#EAF4FF] text-[#2D9CDB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">На сегодня</span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-full ${
                        statusFilter === "today"
                          ? "bg-[#2D9CDB] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {getStatusCount("today")}
                    </span>
                  </button>

                  <button
                    onClick={() => setStatusFilter("tomorrow")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      statusFilter === "tomorrow"
                        ? "bg-[#EAF4FF] text-[#2D9CDB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">На завтра</span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-full ${
                        statusFilter === "tomorrow"
                          ? "bg-[#2D9CDB] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      0
                    </span>
                  </button>

                  <button
                    onClick={() => setStatusFilter("week")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      statusFilter === "week"
                        ? "bg-[#EAF4FF] text-[#2D9CDB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">На неделю</span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-full ${
                        statusFilter === "week"
                          ? "bg-[#2D9CDB] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      0
                    </span>
                  </button>

                  <button
                    onClick={() => setStatusFilter("completed")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      statusFilter === "completed"
                        ? "bg-[#EAF4FF] text-[#2D9CDB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">Выполнено</span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-full ${
                        statusFilter === "completed"
                          ? "bg-[#2D9CDB] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {getStatusCount("completed")}
                    </span>
                  </button>

                  <button
                    onClick={() => setStatusFilter("overdue")}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                      statusFilter === "overdue"
                        ? "bg-[#EAF4FF] text-[#2D9CDB]"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="font-medium">Просроченные</span>
                    <span
                      className={`text-[12px] px-2 py-0.5 rounded-full ${
                        statusFilter === "overdue"
                          ? "bg-[#2D9CDB] text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      0
                    </span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Раздел "МЛС" */}
          <div>
            <div className="p-4 pb-2">
              <button
                onClick={() => setIsMlsExpanded(!isMlsExpanded)}
                className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
              >
                <h3 className="text-gray-900">МЛС</h3>
                {isMlsExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                )}
              </button>

              {/* Переключатель Входящие/Исходящие */}
              {isMlsExpanded && (
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-3">
                  <button
                    onClick={() => setMlsDirection("incoming")}
                    className={`flex-1 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                      mlsDirection === "incoming"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Входящие
                  </button>
                  <button
                    onClick={() => setMlsDirection("outgoing")}
                    className={`flex-1 px-3 py-1.5 rounded-md text-[13px] transition-colors ${
                      mlsDirection === "outgoing"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Исходящие
                  </button>
                </div>
              )}
            </div>

            {isMlsExpanded && (
              <div className="px-2 pb-4 space-y-1">
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
                    <Handshake className="w-4 h-4" />
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

                <button
                  onClick={() => setStatusFilter("mls-showing")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    statusFilter === "mls-showing"
                      ? "bg-[#EAF4FF] text-[#2D9CDB]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Назначение показа</span>
                  </div>
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-full ${
                      statusFilter === "mls-showing"
                        ? "bg-[#2D9CDB] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {getStatusCount("mls-showing")}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("mls-deposit")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    statusFilter === "mls-deposit"
                      ? "bg-[#EAF4FF] text-[#2D9CDB]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CircleDollarSign className="w-4 h-4" />
                    <span className="font-medium">
                      Готов вносить аванс/задаток
                    </span>
                  </div>
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-full ${
                      statusFilter === "mls-deposit"
                        ? "bg-[#2D9CDB] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {getStatusCount("mls-deposit")}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("mls-closed")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    statusFilter === "mls-closed"
                      ? "bg-[#EAF4FF] text-[#2D9CDB]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    <span className="font-medium">Сделка закрыта</span>
                  </div>
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-full ${
                      statusFilter === "mls-closed"
                        ? "bg-[#2D9CDB] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {getStatusCount("mls-closed")}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter("mls-commission-received")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                    statusFilter === "mls-commission-received"
                      ? "bg-[#EAF4FF] text-[#2D9CDB]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">КВ получена</span>
                  </div>
                  <span
                    className={`text-[12px] px-2 py-0.5 rounded-full ${
                      statusFilter === "mls-commission-received"
                        ? "bg-[#2D9CDB] text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {getStatusCount("mls-commission-received")}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Раздел "Меняй и живи" */}
          <div>
            <div className="p-4 pb-2">
              <button
                onClick={() => {
                  /* пока без функционала */
                }}
                className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
              >
                <h3 className="text-gray-900">Меняй и живи</h3>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Раздел "Новостройки" */}
          <div>
            <div className="p-4 pb-2">
              <button
                onClick={() => {
                  /* пока без функционала */
                }}
                className="flex items-center justify-between w-full mb-3 hover:bg-gray-50 rounded-lg px-2 py-1 -mx-2 transition-colors"
              >
                <h3 className="text-gray-900">Новостройки</h3>
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Правая часть - список задач (стакан) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Заголовок списка */}
          <div className="px-6 py-4 bg-white border-b border-gray-200 flex items-baseline justify-between">
            <h2 className="text-gray-900">Задачи ({filteredTasks.length})</h2>

            {/* Блок потенциала пар */}
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

          {/* Список задач со скрол��ом */}
          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-3">
              {filteredTasks.map((task, index) => {
                const isOutgoing = mlsDirection === "outgoing";
                const taskActionsClicked = actionsClicked[task.id] || [];

                // Определяем, нужно ли показывать статус
                const shouldShowStatus = (() => {
                  // Для исходящих задач типа "фиксация условий" и "назначение показа"
                  if (
                    isOutgoing &&
                    (task.type === "terms-fixing" ||
                      task.type === "showing-schedule")
                  ) {
                    // Показываем статус только если была нажата соответствующая кнопка
                    const relevantAction =
                      task.type === "terms-fixing"
                        ? "propose-terms"
                        : "negotiate-showing";
                    return taskActionsClicked.includes(relevantAction);
                  }
                  // Для исходящих задач ти��а "готов вносить аванс/задаток"
                  if (isOutgoing && task.type === "deposit-ready") {
                    // Показываем статус только если была нажата кнопка "Открыть сделку"
                    return taskActionsClicked.includes("open-deal");
                  }
                  // Для остальных задач всегда показываем статус
                  return true;
                })();

                // Определяем, какие действия были выполнены
                const hasAnyAction = taskActionsClicked.length > 0;

                return (
                  <div key={task.id}>
                    <div
                      className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setSelectedTask(task)}
                    >
                      {/* Заголовок карточки */}
                      <div className="flex items-start gap-4 mb-4">
                        {/* Иконка типа задачи */}
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                          {getTaskTypeIcon(task.type)}
                        </div>

                        {/* Информация о задаче */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm text-gray-500">
                                  {getTaskTypeLabel(task.type)}
                                </span>
                              </div>
                              <h3 className="text-gray-900">
                                {task.description}
                              </h3>
                            </div>
                            {shouldShowStatus && (
                              <Badge
                                className={
                                  task.status === "awaiting-response"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : task.status === "transferred-to-mss"
                                      ? "bg-blue-100 text-blue-800"
                                      : task.status === "awaiting-actions"
                                        ? "bg-orange-100 text-orange-800"
                                        : "bg-green-100 text-green-800"
                                }
                              >
                                {getStatusLabel(task.status)}
                              </Badge>
                            )}
                          </div>

                          {/* Агент и дата */}
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
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
                            <span>•</span>
                            <span>{task.date}</span>
                            <span>•</span>
                            <span className="text-blue-600">
                              {task.potential}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Кнопки действий */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        {/* Если было любое действие - показываем "Открыть чат" */}
                        {hasAnyAction ? (
                          <Button
                            size="sm"
                            className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskAction(task.id, "open-chat");
                            }}
                          >
                            Открыть чат
                          </Button>
                        ) : (
                          <>
                            {/* Исходные кнопки действий */}
                            {task.type === "new-chat" && (
                              <Button
                                size="sm"
                                className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "message");
                                }}
                              >
                                {isOutgoing ? "Открыть чат" : "Ответить"}
                              </Button>
                            )}

                            {task.type === "terms-fixing" && (
                              <>
                                {isOutgoing ? (
                                  // Для исходящих - "Открыть чат" и "Предложить условия"
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskAction(task.id, "open-chat");
                                      }}
                                    >
                                      Открыть чат
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskAction(
                                          task.id,
                                          "propose-terms",
                                        );
                                      }}
                                    >
                                      Предложить условия
                                    </Button>
                                  </>
                                ) : (
                                  // Для входящих - "Открыть чат" и "Принять условия"
                                  <>
                                    <Button
                                      size="sm"
                                      className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskAction(task.id, "open-chat");
                                      }}
                                    >
                                      Открыть чат
                                    </Button>
                                    <Button
                                      size="sm"
                                      className="bg-[#43A047] hover:bg-[#388E3C] text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleTaskAction(
                                          task.id,
                                          "accept-terms",
                                        );
                                      }}
                                    >
                                      Принять условия
                                    </Button>
                                  </>
                                )}
                              </>
                            )}

                            {task.type === "showing-schedule" && (
                              <>
                                {isOutgoing ? (
                                  // Для исходящих - только "Согласовать показ"
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskAction(
                                        task.id,
                                        "negotiate-showing",
                                      );
                                    }}
                                  >
                                    Согласовать время показа
                                  </Button>
                                ) : (
                                  // Для входящих - только "Подтвердить время показа"
                                  <Button
                                    size="sm"
                                    className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskAction(
                                        task.id,
                                        "confirm-showing",
                                      );
                                    }}
                                  >
                                    Подтвердить время показа
                                  </Button>
                                )}
                              </>
                            )}

                            {task.type === "deposit-ready" && (
                              <Button
                                size="sm"
                                className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "open-deal");
                                }}
                              >
                                Открыть сделку
                              </Button>
                            )}

                            {task.type === "deal-closed" && (
                              <Button
                                size="sm"
                                className="bg-[#43A047] hover:bg-[#388E3C] text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTaskAction(task.id, "get-commission");
                                }}
                              >
                                Получить КВ
                              </Button>
                            )}

                            {task.type === "commission-received" && (
                              <span className="text-sm text-gray-500 italic">
                                Комиссия получена
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Разделитель между задачами (кроме последней) */}
                    {index < filteredTasks.length - 1 && (
                      <div className="h-px bg-gray-200 my-3" />
                    )}
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>Нет задач для отображения</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Модалка: Настройки ИИ-ассистента */}
      <Dialog
        open={showAIAssistantModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowAIAssistantModal(false);
            setAiAssistantDraft(aiAssistantSettings);
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>ИИ-ассистент</DialogTitle>
            <DialogDescription>
              Управление поведением ИИ‑агента в МЛС Терминале. Настройки
              применяются только в рамках прототипа.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Режим</Label>
              <RadioGroup
                value={aiAssistantDraft.mode}
                onValueChange={(value) => {
                  const mode = value === "reply" ? "reply" : "start";
                  setAiAssistantDraft((prev) => ({ ...prev, mode }));
                }}
                className="gap-4"
              >
                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <RadioGroupItem value="start" id="ai-mode-start" />
                  <div className="space-y-1">
                    <Label htmlFor="ai-mode-start" className="font-medium">
                      ИИ агент может начинать диалог по парам
                    </Label>
                    <div className="text-sm text-gray-600">
                      Ограничение: не более 3 обсуждений в сутки.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-3">
                  <RadioGroupItem value="reply" id="ai-mode-reply" />
                  <div className="space-y-2 w-full">
                    <Label htmlFor="ai-mode-reply" className="font-medium">
                      ИИ агент может отвечать за меня, если я не ответил
                    </Label>

                    <div className="flex items-center gap-3">
                      <div className="text-sm text-gray-700 shrink-0">
                        Через (часов)
                      </div>
                      <Input
                        inputMode="numeric"
                        maxLength={2}
                        value={aiAssistantDraft.autoReplyAfterHours}
                        disabled={aiAssistantDraft.mode !== "reply"}
                        onChange={(e) => {
                          const v = e.target.value.replace(/[^0-9]/g, "");
                          setAiAssistantDraft((prev) => ({
                            ...prev,
                            autoReplyAfterHours: v.slice(0, 2),
                          }));
                        }}
                        className="w-[90px]"
                        placeholder="12"
                      />
                    </div>

                    <div className="text-xs text-gray-500">
                      Значение: 0–99. Поле активно только в этом режиме.
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => {
                setShowAIAssistantModal(false);
                setAiAssistantDraft(aiAssistantSettings);
              }}
            >
              Отмена
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                const next = {
                  mode: aiAssistantDraft.mode,
                  autoReplyAfterHours: aiAssistantDraft.autoReplyAfterHours
                    .replace(/[^0-9]/g, "")
                    .slice(0, 2),
                };
                setAiAssistantSettings(next);
                saveAiAssistantSettings(next);
                setShowAIAssistantModal(false);
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Модалка: Предложить деление комиссии */}
      <Dialog
        open={showCommissionSplitModal}
        onOpenChange={(open) => {
          if (!open) {
            setShowCommissionSplitModal(false);
            setCommissionSplitTaskId(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Предложить деление комиссии</DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600">
            Формализованное предложение встречному агенту без перехода в МЛС
            Терминал.
          </p>

          <div className="space-y-4">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="text-gray-700">
                <span className="text-gray-500">Встречный агент:</span> Олеся
                Фивейская
              </div>
              <div className="text-gray-700">
                <span className="text-gray-500">Клиент:</span> Дмитрий Орлов
              </div>
              <div className="text-gray-700">
                <span className="text-gray-500">Объект:</span> Квартира, г.
                Санкт-Петербург, Адмиралтейский р-н, Наб.Обводного канала д. 154
              </div>
            </div>

            <div>
              <div className="text-gray-900 mb-2">Текущие условия сторон</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-gray-900 mb-2">Мои условия</div>
                  <div className="text-sm text-gray-700">
                    Готов делиться: Да
                  </div>
                  <div className="text-sm text-gray-700">
                    Размер в рублях: {rub.format(myConditionsRub)} ₽
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <div className="text-gray-900 mb-2">
                    Условия встречного агента
                  </div>
                  <div className="text-sm text-gray-700">
                    Готов делиться: Да
                  </div>
                  <div className="text-sm text-gray-700">
                    Размер в рублях: {rub.format(partnerConditionsRub)} ₽
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCommission">Общая комиссия</Label>
              <Input
                id="totalCommission"
                inputMode="numeric"
                value={totalCommissionRub}
                onChange={(e) =>
                  setTotalCommissionRub(e.target.value.replace(/[^0-9]/g, ""))
                }
                placeholder="90000"
              />
              <div className="text-xs text-gray-500">
                Рассчитываем автоматически на основании данных из карточек, но
                вы можете внести изменения.
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-gray-900">
                Вы предлагаете распределить комиссию следующим образом:
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="myShare">Ваша доля, %</Label>
                  <Input
                    id="myShare"
                    inputMode="numeric"
                    value={mySharePercent}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/[^0-9]/g, "");
                      const num = Math.min(100, Math.max(0, int(raw)));
                      setMySharePercent(String(num));
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="partnerShare">
                    Доля встречного агента, %
                  </Label>
                  <Input
                    id="partnerShare"
                    value={String(100 - int(mySharePercent))}
                    readOnly
                  />
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-800">
                  {(() => {
                    const total = int(totalCommissionRub);
                    const myP = int(mySharePercent);
                    const myRub = Math.round((total * myP) / 100);
                    const partnerRub = total - myRub;
                    return (
                      <>
                        <div className="font-medium mb-1">
                          Вы предлагаете распределить комиссию следующим
                          образом:
                        </div>
                        <div>
                          Вы — {myP}% ({rub.format(myRub)} ₽)
                        </div>
                        <div>
                          Встречный агент — {100 - myP}% (
                          {rub.format(partnerRub)} ₽)
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setShowCommissionSplitModal(false);
                setCommissionSplitTaskId(null);
              }}
            >
              Отмена
            </Button>
            <Button
              className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
              onClick={() => {
                // TODO: wire to Slack/Chat workflow; for now just close.
                console.log(
                  "submit commission split",
                  commissionSplitTaskId,
                  totalCommissionRub,
                  mySharePercent,
                );
                setShowCommissionSplitModal(false);
                setCommissionSplitTaskId(null);
              }}
            >
              Отправить предложение
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Модалка детальной информации о задаче */}
      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          onAction={handleTaskAction}
        />
      )}

      {/* Модалка настроек уведомлений */}
      <NotificationsSettingsModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />
    </div>
  );
}
