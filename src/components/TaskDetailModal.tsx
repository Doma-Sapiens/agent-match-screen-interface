import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Award, Calendar, DollarSign, MapPin, User, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string) => void;
}

export function TaskDetailModal({ task, isOpen, onClose, onAction }: TaskDetailModalProps) {
  const getTaskTypeLabel = (type: TaskType) => {
    const labels: Record<TaskType, string> = {
      commission: "Деление комиссии",
      showing: "Назначение показа",
      confirmation: "Подтверждение пары",
      other: "Прочее"
    };
    return labels[type];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gray-900">
            {getTaskTypeLabel(task.type)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Информация об агенте */}
          <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={task.agent.avatar}
              alt={task.agent.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-900">{task.agent.name}</span>
                {task.agent.hasMedal && <Award className="w-4 h-4 text-blue-600" />}
              </div>
              <div className="text-gray-600 text-sm">{task.agent.company}</div>
              <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
                <Calendar className="w-4 h-4" />
                <span>{task.date}</span>
              </div>
            </div>
          </div>

          {/* Предложение */}
          {task.details.proposal && (
            <div>
              <h4 className="text-gray-900 mb-2">Предложение</h4>
              <p className="text-gray-700 bg-blue-50 p-4 rounded-lg">{task.details.proposal}</p>
            </div>
          )}

          {/* Информация об объекте */}
          {task.details.property && (
            <div>
              <h4 className="text-gray-900 mb-3">Объект</h4>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={task.details.property.imageUrl}
                  alt={task.details.property.address}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-900">{task.details.property.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-900 font-semibold">{task.details.property.price}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Информация о покупателе */}
          {task.details.buyer && (
            <div>
              <h4 className="text-gray-900 mb-3">Покупатель</h4>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-900">{task.details.buyer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">Бюджет: {task.details.buyer.budget}</span>
                </div>
              </div>
            </div>
          )}

          {/* Потенциал сделки */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Потенциал сделки</span>
              <span className="text-green-700 font-semibold text-lg">{task.potential}</span>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
            {task.type === "commission" && task.status === "new" && (
              <>
                <Button
                  onClick={() => onAction("accept")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Согласиться на деление
                </Button>
                <Button
                  onClick={() => onAction("discuss")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Обсудить в чате
                </Button>
                <Button
                  onClick={() => onAction("decline")}
                  variant="outline"
                  className="flex-1"
                >
                  Отклонить
                </Button>
              </>
            )}

            {task.type === "showing" && task.status === "new" && (
              <>
                <Button
                  onClick={() => onAction("accept")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Принять время
                </Button>
                <Button
                  onClick={() => onAction("change")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Изменить дату
                </Button>
                <Button
                  onClick={() => onAction("cancel")}
                  variant="outline"
                  className="flex-1"
                >
                  Отменить
                </Button>
              </>
            )}

            {task.type === "confirmation" && (
              <>
                <Button
                  onClick={() => onAction("confirm")}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  Подтвердить интерес
                </Button>
                <Button
                  onClick={() => onAction("discuss")}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Перейти в чат
                </Button>
                <Button
                  onClick={() => onAction("not-interested")}
                  variant="outline"
                  className="flex-1"
                >
                  Неинтересно
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}