import { useEffect, useMemo, useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";

type TaskType = "new-chat" | "terms-fixing";
type TaskDirection = "incoming" | "outgoing";
type TaskStatus =
  | "awaiting-terms-approval"
  | "terms-approved"
  | "rejected"
  | "ignored";

type CommissionEventType =
  | "chat_opened"
  | "terms_opened"
  | "commission_accepted"
  | "commission_declined"
  | "commission_changed"
  | "commission_proposed"
  | "commission_ignored";

interface CommissionVersion {
  id: string;
  percentage: string;
  scheme: string;
  comment: string;
  expiresAt: string;
  createdAt: string;
}

interface CommissionEvent {
  id: string;
  type: CommissionEventType;
  createdAt: string;
  comment?: string;
  versionId?: string;
}

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
    commissionVersions?: CommissionVersion[];
    activeCommissionVersionId?: string;
    commissionEvents?: CommissionEvent[];
  };
}

interface TasksViewV3Props {
  onBack?: () => void;
  onOpenChat?: (task: Task, action?: string) => void;
  hideAllTasksNavigation?: boolean;
  hidePotentialPairs?: boolean;
}

interface TermsModalState {
  taskId: string;
  declineComment: string;
}

interface ProposalModalState {
  taskId: string;
  mode: "change" | "new";
  percentage: string;
  scheme: string;
  comment: string;
  expiresAt: string;
}

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDateTime(date: Date) {
  return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}, ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
}

function parseDateTime(value: string) {
  const [datePart, timePart] = value.split(",").map((p) => p.trim());
  if (!datePart || !timePart) return null;
  const [d, m, y] = datePart.split(".").map(Number);
  const [hh, mm] = timePart.split(":").map(Number);
  if ([d, m, y, hh, mm].some((n) => Number.isNaN(n))) return null;
  return new Date(y, m - 1, d, hh, mm);
}

function getActiveCommissionVersion(task: Task): CommissionVersion | null {
  const versions = task.details.commissionVersions || [];
  if (versions.length === 0) return null;
  if (task.details.activeCommissionVersionId) {
    return (
      versions.find((v) => v.id === task.details.activeCommissionVersionId) ||
      versions[versions.length - 1]
    );
  }
  return versions[versions.length - 1];
}

function appendEvent(task: Task, event: CommissionEvent): Task {
  return {
    ...task,
    details: {
      ...task.details,
      commissionEvents: [...(task.details.commissionEvents || []), event],
    },
  };
}

function withCommissionTerms(
  task: Omit<Task, "details"> & {
    details: Omit<Task["details"], "commissionVersions" | "activeCommissionVersionId" | "commissionEvents">;
  },
  version: Omit<CommissionVersion, "id" | "createdAt">,
): Task {
  const versionId = makeId("ver");
  const createdAt = formatDateTime(new Date());
  return {
    ...task,
    details: {
      ...task.details,
      commissionVersions: [{ ...version, id: versionId, createdAt }],
      activeCommissionVersionId: versionId,
      commissionEvents: [],
    },
  };
}

function IconMenu() {
  return (
    <div className="relative shrink-0 size-[40px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <rect fill="#318BFF" height="40" rx="8" width="40" />
        <path d="M12 14h16M12 20h16M12 26h10" stroke="white" strokeLinecap="round" strokeWidth="2" />
      </svg>
    </div>
  );
}

function IconStreaming() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p4127880} fill="var(--fill-0, white)" />
      </svg>
    </div>
  );
}

function IconChat() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path clipRule="evenodd" d={svgPaths.p28356580} fill="var(--fill-0, #318BFF)" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconPhone() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p1c59e800} fill="var(--fill-0, #318BFF)" />
      </svg>
    </div>
  );
}

function IconSearch() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p1fd693f0} fill="var(--fill-0, #318BFF)" />
        <path clipRule="evenodd" d={svgPaths.pd757500} fill="var(--fill-0, #318BFF)" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IconBill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-0 overflow-clip">
        <div className="absolute h-[19px] left-[calc(50%+0.341px)] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%] w-[16.683px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 19">
            <path clipRule="evenodd" d={svgPaths.p19868900} fill="var(--fill-0, #318BFF)" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

const INITIAL_TASKS: Task[] = [
  withCommissionTerms(
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
      },
    },
    {
      percentage: "50/50",
      scheme: "Равное деление комиссии между агентами",
      comment: "Клиент подтвержден, готовы к быстрому выходу на сделку.",
      expiresAt: formatDateTime(new Date(Date.now() + 1000 * 60 * 60 * 24)),
    },
  ),
  withCommissionTerms(
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
      percentage: "40/60",
      scheme: "40% агенту покупателя / 60% агенту продавца",
      comment: "Подтверждено обеими сторонами.",
      expiresAt: formatDateTime(new Date(Date.now() + 1000 * 60 * 60 * 36)),
    },
  ),
  withCommissionTerms(
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
      percentage: "50/50",
      scheme: "Равное деление комиссии между агентами",
      comment: "Партнер отклонил условия.",
      expiresAt: formatDateTime(new Date(Date.now() + 1000 * 60 * 60 * 24)),
    },
  ),
  withCommissionTerms(
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
      statusHint: "Срок действия предложения истек",
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
      percentage: "45/55",
      scheme: "45% агенту покупателя / 55% агенту продавца",
      comment: "Ответ не получен в срок.",
      expiresAt: formatDateTime(new Date(Date.now() - 1000 * 60 * 60 * 2)),
    },
  ),
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
  const [statusFilter, setStatusFilter] = useState("mls-all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [termsModal, setTermsModal] = useState<TermsModalState | null>(null);
  const [proposalModal, setProposalModal] = useState<ProposalModalState | null>(null);

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
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
      }),
    [tasks, statusFilter, typeFilter, searchQuery],
  );

  const termsTask = termsModal
    ? tasks.find((t) => t.id === termsModal.taskId && t.type === "terms-fixing") || null
    : null;
  const proposalTask = proposalModal
    ? tasks.find((t) => t.id === proposalModal.taskId && t.type === "terms-fixing") || null
    : null;
  const activeTermsVersion = termsTask ? getActiveCommissionVersion(termsTask) : null;

  const setTask = (taskId: string, updater: (task: Task) => Task) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? updater(task) : task)));
  };

  const logEvent = (
    task: Task,
    type: CommissionEventType,
    comment?: string,
    versionId?: string,
  ): Task => {
    return appendEvent(task, {
      id: makeId("evt"),
      type,
      createdAt: formatDateTime(new Date()),
      comment,
      versionId,
    });
  };

  const createVersion = (
    task: Task,
    payload: Omit<CommissionVersion, "id" | "createdAt">,
  ): { task: Task; versionId: string } => {
    const versionId = makeId("ver");
    const version: CommissionVersion = {
      ...payload,
      id: versionId,
      createdAt: formatDateTime(new Date()),
    };
    const currentVersions = task.details.commissionVersions || [];
    return {
      task: {
        ...task,
        details: {
          ...task.details,
          commissionVersions: [...currentVersions, version],
          activeCommissionVersionId: versionId,
        },
      },
      versionId,
    };
  };

  const getStatusCount = (filter: string) => {
    if (filter === "mls-all") return tasks.length;
    if (filter === "mls-new-chat") return tasks.filter((t) => t.type === "new-chat").length;
    if (filter === "mls-terms") return tasks.filter((t) => t.type === "terms-fixing").length;
    return 0;
  };

  const getTaskTypeLabel = (type: TaskType) =>
    type === "new-chat" ? "Новый чат" : "Фиксация условий";

  const getTaskTypeIcon = (type: TaskType) =>
    type === "new-chat" ? <MessageCircle className="w-5 h-5" /> : <FileText className="w-5 h-5" />;

  const getStatusLabel = (status?: TaskStatus) => {
    if (!status) return "";
    if (status === "awaiting-terms-approval") return "Ожидает решения";
    if (status === "terms-approved") return "Условия согласованы";
    if (status === "rejected") return "Отклонено";
    return "Проигнорировано";
  };

  const getStatusClassName = (status?: TaskStatus) => {
    if (!status) return "";
    if (status === "awaiting-terms-approval") return "bg-sky-100 text-sky-800";
    if (status === "terms-approved") return "bg-green-100 text-green-800";
    if (status === "rejected") return "bg-red-100 text-red-800";
    return "bg-gray-200 text-gray-700";
  };

  const openChat = (task: Task) => {
    const withEvent =
      task.type === "terms-fixing"
        ? logEvent(task, "chat_opened", undefined, task.details.activeCommissionVersionId)
        : task;
    if (task.type === "terms-fixing") {
      setTask(task.id, () => withEvent);
    }
    if (onOpenChat) onOpenChat(withEvent, "open-chat");
  };

  const openTerms = (task: Task) => {
    setTask(task.id, (current) =>
      logEvent(current, "terms_opened", undefined, current.details.activeCommissionVersionId),
    );
    setTermsModal({ taskId: task.id, declineComment: "" });
  };

  const acceptTerms = () => {
    if (!termsTask) return;
    setTask(termsTask.id, (current) => {
      const withEvent = logEvent(
        current,
        "commission_accepted",
        undefined,
        current.details.activeCommissionVersionId,
      );
      return { ...withEvent, status: "terms-approved", statusHint: undefined };
    });
    setTermsModal(null);
  };

  const declineTerms = () => {
    if (!termsTask || !termsModal) return;
    const comment = termsModal.declineComment.trim();
    setTask(termsTask.id, (current) => {
      const withEvent = logEvent(
        current,
        "commission_declined",
        comment || undefined,
        current.details.activeCommissionVersionId,
      );
      return { ...withEvent, status: "rejected", statusHint: undefined };
    });
    setTermsModal(null);
  };

  const openProposalModal = (task: Task, mode: "change" | "new") => {
    const active = getActiveCommissionVersion(task);
    setProposalModal({
      taskId: task.id,
      mode,
      percentage: active?.percentage || "50/50",
      scheme: active?.scheme || "Равное деление комиссии между агентами",
      comment: "",
      expiresAt: formatDateTime(new Date(Date.now() + 1000 * 60 * 60 * 24)),
    });
  };

  const saveProposal = () => {
    if (!proposalModal || !proposalTask) return;
    const payload = {
      percentage: proposalModal.percentage.trim(),
      scheme: proposalModal.scheme.trim(),
      comment: proposalModal.comment.trim(),
      expiresAt: proposalModal.expiresAt.trim(),
    };
    if (!payload.percentage || !payload.scheme || !payload.expiresAt) return;

    setTask(proposalTask.id, (current) => {
      const next = createVersion(current, payload);
      const eventType =
        proposalModal.mode === "change" ? "commission_changed" : "commission_proposed";
      const withEvent = logEvent(next.task, eventType, payload.comment || undefined, next.versionId);
      return { ...withEvent, status: "awaiting-terms-approval", statusHint: undefined };
    });
    setProposalModal(null);
  };

  const resendProposal = (task: Task) => {
    const active = getActiveCommissionVersion(task);
    if (!active) return;
    const nextExpiresAt = formatDateTime(new Date(Date.now() + 1000 * 60 * 60 * 24));
    setTask(task.id, (current) => {
      const next = createVersion(current, {
        percentage: active.percentage,
        scheme: active.scheme,
        comment: active.comment,
        expiresAt: nextExpiresAt,
      });
      const withEvent = logEvent(next.task, "commission_proposed", undefined, next.versionId);
      return { ...withEvent, status: "awaiting-terms-approval", statusHint: undefined };
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTasks((prev) =>
        prev.map((task) => {
          if (task.type !== "terms-fixing" || task.status !== "awaiting-terms-approval") {
            return task;
          }
          const activeVersion = getActiveCommissionVersion(task);
          if (!activeVersion) return task;
          const expires = parseDateTime(activeVersion.expiresAt);
          if (!expires || expires.getTime() > Date.now()) return task;

          const alreadyIgnored = (task.details.commissionEvents || []).some(
            (event) => event.type === "commission_ignored" && event.versionId === activeVersion.id,
          );
          if (alreadyIgnored) return task;

          const withEvent = appendEvent(task, {
            id: makeId("evt"),
            type: "commission_ignored",
            createdAt: formatDateTime(new Date()),
            versionId: activeVersion.id,
          });
          return {
            ...withEvent,
            status: "ignored",
            statusHint: "Срок действия предложения истек",
          };
        }),
      );
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const renderActions = (task: Task) => {
    if (task.type === "new-chat") {
      return (
        <Button
          size="sm"
          className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
          onClick={() => openChat(task)}
        >
          Открыть чат
        </Button>
      );
    }

    if (task.status === "ignored") {
      return (
        <Button
          size="sm"
          variant="outline"
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
          onClick={() => resendProposal(task)}
        >
          Отправить повторно
        </Button>
      );
    }

    return (
      <>
        <Button
          size="sm"
          className="bg-[#1976D2] hover:bg-[#1565C0] text-white"
          onClick={() => openChat(task)}
        >
          Открыть чат
        </Button>
        {task.status === "awaiting-terms-approval" && (
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => openTerms(task)}
          >
            Открыть условия
          </Button>
        )}
        {task.status === "terms-approved" && (
          <Button
            size="sm"
            variant="outline"
            className="border-amber-300 text-amber-800 hover:bg-amber-50"
            onClick={() => openProposalModal(task, "change")}
          >
            Изменить условия
          </Button>
        )}
        {task.status === "rejected" && (
          <Button
            size="sm"
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={() => openProposalModal(task, "new")}
          >
            Отправить новое предложение
          </Button>
        )}
      </>
    );
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
              <img alt="" className="block max-w-none size-full" height="40" src={imgEllipse68} width="40" />
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

          <div className="px-2 pb-4 space-y-1 pt-4">
            {[
              { key: "mls-all", title: "Все", icon: <Archive className="w-4 h-4" /> },
              { key: "mls-new-chat", title: "Новый чат", icon: <MessageCircleMore className="w-4 h-4" /> },
              { key: "mls-terms", title: "Фиксация условий", icon: <FileText className="w-4 h-4" /> },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  statusFilter === item.key
                    ? "bg-[#EAF4FF] text-[#2D9CDB]"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {item.icon}
                  <span className="font-medium">{item.title}</span>
                </div>
                <span
                  className={`text-[12px] px-2 py-0.5 rounded-full ${
                    statusFilter === item.key ? "bg-[#2D9CDB] text-white" : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {getStatusCount(item.key)}
                </span>
              </button>
            ))}
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
                      <span className="font-semibold text-[#007AFF] text-sm">Потенциал пар — 350 000 ₽</span>
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
              {filteredTasks.map((task, index) => (
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
                              <span className="text-sm text-gray-500">{getTaskTypeLabel(task.type)}</span>
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {task.direction === "outgoing" ? "Исходящее" : "Входящее"}
                              </span>
                            </div>
                            <h3 className="text-gray-900">{task.description}</h3>
                          </div>
                          {task.type === "terms-fixing" && task.status && (
                            <div className="text-right">
                              <Badge className={getStatusClassName(task.status)}>{getStatusLabel(task.status)}</Badge>
                              {task.statusHint && <p className="text-[11px] text-gray-500 mt-1">{task.statusHint}</p>}
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
                              {task.agent.hasMedal && <Award className="w-3.5 h-3.5 text-blue-600" />}
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

                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">{renderActions(task)}</div>
                  </div>
                  {index < filteredTasks.length - 1 && <div className="h-px bg-gray-200 my-3" />}
                </div>
              ))}

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

      <Dialog open={!!termsModal} onOpenChange={(open) => !open && setTermsModal(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Условия комиссии</DialogTitle>
            <DialogDescription>
              {termsTask?.details.property?.address
                ? `Объект: ${termsTask.details.property.address}`
                : "Просмотр условий комиссии"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="rounded-md border border-gray-200 p-3">
              <p className="text-[12px] text-gray-500 mb-1">Процент / схема</p>
              <p className="text-sm text-gray-900">
                {activeTermsVersion?.percentage || "-"} - {activeTermsVersion?.scheme || "-"}
              </p>
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              <p className="text-[12px] text-gray-500 mb-1">Комментарий</p>
              <p className="text-sm text-gray-900">{activeTermsVersion?.comment || "-"}</p>
            </div>
            <div className="rounded-md border border-gray-200 p-3">
              <p className="text-[12px] text-gray-500 mb-1">Срок действия</p>
              <p className="text-sm text-gray-900">{activeTermsVersion?.expiresAt || "-"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Комментарий (необязательно)</p>
              <Textarea
                value={termsModal?.declineComment || ""}
                onChange={(e) =>
                  setTermsModal((prev) => (prev ? { ...prev, declineComment: e.target.value } : prev))
                }
                placeholder="Комментарий к отклонению (необязательно)"
                className="min-h-[80px]"
              />
              <p className="text-[12px] text-gray-500">
                Комментарий, если введен, сохраняется в истории без дополнительных уведомлений.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTermsModal(null)}>
              Закрыть
            </Button>
            <Button
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              onClick={declineTerms}
            >
              Отклонить
            </Button>
            <Button className="bg-[#43A047] hover:bg-[#388E3C] text-white" onClick={acceptTerms}>
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!proposalModal} onOpenChange={(open) => !open && setProposalModal(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {proposalModal?.mode === "change" ? "Изменить условия комиссии" : "Новое предложение комиссии"}
            </DialogTitle>
            <DialogDescription>
              {proposalTask?.details.property?.address
                ? `Объект: ${proposalTask.details.property.address}`
                : "Формирование предложения"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Процент</p>
              <Input
                value={proposalModal?.percentage || ""}
                onChange={(e) =>
                  setProposalModal((prev) => (prev ? { ...prev, percentage: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Схема</p>
              <Input
                value={proposalModal?.scheme || ""}
                onChange={(e) =>
                  setProposalModal((prev) => (prev ? { ...prev, scheme: e.target.value } : prev))
                }
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Комментарий</p>
              <Textarea
                value={proposalModal?.comment || ""}
                onChange={(e) =>
                  setProposalModal((prev) => (prev ? { ...prev, comment: e.target.value } : prev))
                }
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-700">Срок действия</p>
              <Input
                value={proposalModal?.expiresAt || ""}
                onChange={(e) =>
                  setProposalModal((prev) => (prev ? { ...prev, expiresAt: e.target.value } : prev))
                }
                placeholder="ДД.MM.ГГГГ, ЧЧ:MM"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProposalModal(null)}>
              Закрыть
            </Button>
            <Button className="bg-[#1976D2] hover:bg-[#1565C0] text-white" onClick={saveProposal}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
