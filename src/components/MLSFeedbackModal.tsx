import { useState } from "react";
import { X, Star } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface MLSFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (rating: number, feedback: string) => void;
  onRemindLater?: () => void;
}

export function MLSFeedbackModal({ isOpen, onClose, onSubmit, onRemindLater }: MLSFeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(rating, feedback);
    }
    // Сброс формы
    setRating(0);
    setFeedback("");
    onClose();
  };

  const handleRemindLater = () => {
    if (onRemindLater) {
      onRemindLater();
    }
    // Сброс формы
    setRating(0);
    setFeedback("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[600px] p-0 gap-0 bg-white">
        {/* Контент модалки */}
        <div className="p-8">
          {/* Заголовок */}
          <DialogTitle className="text-gray-900 mb-3">
            Помогите нам сделать MLS удобнее
          </DialogTitle>

          {/* Описание */}
          <DialogDescription className="text-gray-600 mb-6">
            Мы тестируем новый функционал. Расскажите, насколько удобно вам было работать — это займёт меньше минуты
          </DialogDescription>

          {/* Текст над звездами */}
          <p className="text-gray-900 mb-4">
            Оцените удобство работы с MLS
          </p>

          {/* Звезды */}
          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || rating)
                      ? "fill-[#FFD700] text-[#FFD700]"
                      : "fill-none text-gray-300"
                  } transition-colors`}
                />
              </button>
            ))}
          </div>

          {/* Текстовое поле */}
          <Textarea
            placeholder="Что можно улучшить?"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px] mb-6 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />

          {/* Кнопки */}
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={handleSubmit}
              className="bg-[#2F80ED] hover:bg-[#1976D2] text-white px-8"
              disabled={rating === 0}
            >
              Отправить
            </Button>
            <button
              onClick={handleRemindLater}
              className="text-gray-900 hover:text-gray-700 transition-colors"
            >
              Напомнить позже
            </button>
          </div>

          {/* Текст внизу */}
          <p className="text-gray-600 text-sm">
            Ваш отзыв поможет быстрее доработать систему под ваши задачи
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
