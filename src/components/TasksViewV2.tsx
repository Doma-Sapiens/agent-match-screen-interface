import { useState } from "react";
import svgPaths from "../imports/svg-8hi1w0fiur";
import imgEllipse68 from "figma:asset/191067899860343e7ef97fcc6506490eb4fba582.png";
import { Button } from "./ui/button";
import { Award, Calendar, DollarSign, User, ArrowLeft, RefreshCw, MessageCircle } from "lucide-react";
import { TaskDetailModal } from "./TaskDetailModal";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, DragOverEvent, closestCenter, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface TasksViewV2Props {
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

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onAction: (action: string) => void;
}

function DroppableColumn({ 
  id, 
  children, 
  className 
}: { 
  id: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`${className} ${isOver ? 'ring-2 ring-blue-400' : ''}`}
    >
      {children}
    </div>
  );
}

function SortableTaskCard({ task, onClick, onAction }: TaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getTaskTypeLabel = (type: TaskType) => {
    const labels: Record<TaskType, string> = {
      commission: "Деление комиссии",
      showing: "Назначение показа",
      confirmation: "Подтверждение пары",
      other: "Прочее"
    };
    return labels[type];
  };

  const getTaskTypeColor = (type: TaskType) => {
    const colors: Record<TaskType, string> = {
      commission: "bg-purple-100 text-purple-700",
      showing: "bg-blue-100 text-blue-700",
      confirmation: "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700"
    };
    return colors[type];
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
    >
      {/* Заголовок */}
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${getTaskTypeColor(task.type)}`}>
          {getTaskTypeLabel(task.type)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="text-[#318bff] hover:text-[#1976d2] text-[11px]"
        >
          Детали →
        </button>
      </div>

      {/* Агент */}
      <div className="flex items-center gap-2 mb-3">
        <img src={task.agent.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-[13px] text-gray-900 truncate">{task.agent.name.split(" ")[0]} {task.agent.name.split(" ")[1]}</span>
            {task.agent.hasMedal && <Award className="w-3 h-3 text-blue-600 flex-shrink-0" />}
          </div>
          <span className="text-[11px] text-gray-500 truncate block">{task.agent.company}</span>
        </div>
      </div>

      {/* Описание */}
      <p className="text-[13px] text-gray-700 mb-3 line-clamp-2">{task.description}</p>

      {/* Потенциал */}
      <div className="bg-green-50 border border-green-200 rounded-md p-2 mb-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-gray-600">Потенциал</span>
          <span className="text-[14px] text-green-700 font-semibold">{task.potential}</span>
        </div>
      </div>

      {/* Дата */}
      <div className="flex items-center gap-1 text-gray-500 text-[11px] mb-3">
        <Calendar className="w-3 h-3" />
        <span>{task.date}</span>
      </div>

      {/* Кнопки действий */}
      <div className="flex flex-wrap gap-1">
        {task.type === "commission" && task.status !== "completed" && (
          <>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAction("accept");
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] px-2 py-1 h-7"
            >
              Согласиться
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAction("discuss");
              }}
              className="flex-1 bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-2 py-1 h-7"
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
                onAction("accept");
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] px-2 py-1 h-7"
            >
              Принять
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAction("change");
              }}
              className="flex-1 bg-[#2F80ED] hover:bg-[#1976D2] text-white text-[11px] px-2 py-1 h-7"
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
                onAction("confirm");
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-[11px] px-2 py-1 h-7"
            >
              Подтвердить
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAction("not-interested");
              }}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white text-[11px] px-2 py-1 h-7"
            >
              Неинтересно
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export function TasksViewV2({ onBack }: TasksViewV2Props) {
  const [tasks, setTasks] = useState<Task[]>([
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
  ]);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeId, setActiveId] = useState<string | null>(null);

  const filteredTasks = tasks.filter((task) => {
    if (statusFilter !== "all" && task.status !== statusFilter) return false;
    return true;
  });

  const newTasks = filteredTasks.filter(t => t.status === "new");
  const inProgressTasks = filteredTasks.filter(t => t.status === "in-progress");
  const completedTasks = filteredTasks.filter(t => t.status === "completed");

  const activeTasksCount = tasks.filter(t => t.status === "new" || t.status === "in-progress").length;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const overId = over.id as string;
    
    // Определяем новый статус на основе того, куда перетащили
    let newStatus: TaskStatus | null = null;
    
    // Проверяем, является ли over.id статусом колонки
    if (overId === "new" || overId === "in-progress" || overId === "completed") {
      newStatus = overId as TaskStatus;
    } else {
      // Если перетащили на карточку, найдем её статус
      const targetTask = tasks.find(t => t.id === overId);
      if (targetTask) {
        newStatus = targetTask.status;
      }
    }

    if (!newStatus) return;

    // Обновляем статус задачи
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus as TaskStatus } : task
      )
    );
  };

  const handleTaskAction = (taskId: string, action: string) => {
    console.log(`Задача ${taskId}: действие ${action}`);
    // Если действие "accept" или "confirm", переводим в "completed"
    if (action === "accept" || action === "confirm") {
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId ? { ...task, status: "completed" as TaskStatus } : task
        )
      );
    }
  };

  const handleRefresh = () => {
    console.log("Обновление списка задач");
  };

  const activeDraggedTask = tasks.find(t => t.id === activeId);

  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col" data-name="Задачи v2">
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
              Задачи v2
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
      <div className="flex-1 px-6 py-6">
        {/* Заголовок и подсказка */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-gray-900 mb-1">Мои задачи (v2)</h2>
              <p className="text-gray-600 text-[16px]">{activeTasksCount} активных задач</p>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Обновить список
            </Button>
          </div>

          {/* Подсказка */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            <p className="text-[13px] text-blue-800">
              💡 <strong>Совет:</strong> Перетаскивайте задачи между колонками, чтобы менять статус.
            </p>
          </div>

          {/* Фильтры */}
          <div className="content-stretch flex items-center gap-[10px] mt-4">
            <button
              onClick={() => setStatusFilter("all")}
              className={`${
                statusFilter === "all" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
              } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[10px] relative rounded-full shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff] text-[14px]`}
            >
              Все
            </button>
            <button
              onClick={() => setStatusFilter("new")}
              className={`${
                statusFilter === "new" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
              } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[10px] relative rounded-full shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff] text-[14px]`}
            >
              Новые
            </button>
            <button
              onClick={() => setStatusFilter("in-progress")}
              className={`${
                statusFilter === "in-progress" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
              } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[10px] relative rounded-full shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff] text-[14px]`}
            >
              В работе
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`${
                statusFilter === "completed" ? "bg-[#318bff] text-white" : "bg-white text-[#0d0d0d]"
              } box-border content-stretch flex gap-[10px] items-center justify-center px-[17px] py-[10px] relative rounded-full shrink-0 border border-[#e5effc] transition-colors hover:border-[#318bff] text-[14px]`}
            >
              Выполненные
            </button>
          </div>
        </div>

        {/* Kanban доски */}
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-3 gap-6">
            {/* Колонка: Новые */}
            <div className="flex flex-col">
              <div className="bg-white rounded-t-lg px-4 py-3 border border-b-0 border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">Новые</h3>
                  <span className="bg-[#2D9CDB] text-white text-[12px] px-2 py-1 rounded-full font-medium">
                    {newTasks.length}
                  </span>
                </div>
              </div>
              <DroppableColumn id="new" className="bg-gray-50 rounded-b-lg p-4 border border-t-0 border-gray-200 min-h-[500px] space-y-3 transition-all">
                <SortableContext items={newTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {newTasks.map(task => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                      onAction={(action) => handleTaskAction(task.id, action)}
                    />
                  ))}
                  {newTasks.length === 0 && (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-[13px]">
                      Нет новых задач
                    </div>
                  )}
                </SortableContext>
              </DroppableColumn>
            </div>

            {/* Колонка: В работе */}
            <div className="flex flex-col">
              <div className="bg-white rounded-t-lg px-4 py-3 border border-b-0 border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">В работе</h3>
                  <span className="bg-[#F2C94C] text-white text-[12px] px-2 py-1 rounded-full font-medium">
                    {inProgressTasks.length}
                  </span>
                </div>
              </div>
              <DroppableColumn id="in-progress" className="bg-gray-50 rounded-b-lg p-4 border border-t-0 border-gray-200 min-h-[500px] space-y-3 transition-all">
                <SortableContext items={inProgressTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {inProgressTasks.map(task => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                      onAction={(action) => handleTaskAction(task.id, action)}
                    />
                  ))}
                  {inProgressTasks.length === 0 && (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-[13px]">
                      Нет задач в работе
                    </div>
                  )}
                </SortableContext>
              </DroppableColumn>
            </div>

            {/* Колонка: Выполненные */}
            <div className="flex flex-col">
              <div className="bg-white rounded-t-lg px-4 py-3 border border-b-0 border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-900">Выполненные</h3>
                  <span className="bg-[#27AE60] text-white text-[12px] px-2 py-1 rounded-full font-medium">
                    {completedTasks.length}
                  </span>
                </div>
              </div>
              <DroppableColumn id="completed" className="bg-gray-50 rounded-b-lg p-4 border border-t-0 border-gray-200 min-h-[500px] space-y-3 transition-all">
                <SortableContext items={completedTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                  {completedTasks.map(task => (
                    <SortableTaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTask(task)}
                      onAction={(action) => handleTaskAction(task.id, action)}
                    />
                  ))}
                  {completedTasks.length === 0 && (
                    <div className="flex items-center justify-center h-40 text-gray-400 text-[13px]">
                      Нет выполненных задач
                    </div>
                  )}
                </SortableContext>
              </DroppableColumn>
            </div>
          </div>

          <DragOverlay>
            {activeId && activeDraggedTask ? (
              <div className="bg-white rounded-lg border-2 border-blue-500 p-4 shadow-lg opacity-90">
                <span className="text-[13px] text-gray-900">{activeDraggedTask.description}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
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