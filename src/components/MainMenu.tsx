import { ImageWithFallback } from "./figma/ImageWithFallback";
import logoImage from "figma:asset/d7257c975045ec854093aa1bf8867f5822817e34.png";

interface MainMenuProps {
  onNavigate: (
    section: "buyers" | "sellers" | "tasks" | "pairs" | "mls-terminal",
  ) => void;
}

// Компонент иконки для покупателей (синий градиент)
function BuyersIcon() {
  return (
    <div className="relative size-[100px]">
      <div className="absolute bg-gradient-to-b from-[#318BFF] to-[#1976D2] left-0 rounded-[15px] size-[100px] top-0" />
      <p className="absolute font-bold leading-[22px] left-[50px] text-[20px] text-center text-nowrap text-white top-[39px] translate-x-[-50%] whitespace-pre">
        BUY
      </p>
    </div>
  );
}

// Компонент иконки для продавцов (зеленый градиент)
function SellersIcon() {
  return (
    <div className="relative size-[100px]">
      <div className="absolute bg-gradient-to-b from-[#66BB6A] to-[#43A047] left-0 rounded-[15px] size-[100px] top-0" />
      <p className="absolute font-bold leading-[22px] left-[50px] text-[20px] text-center text-nowrap text-white top-[39px] translate-x-[-50%] whitespace-pre">
        SALE
      </p>
    </div>
  );
}

// Компонент иконки для задач (оранжевый градиент)
function TasksIcon() {
  return (
    <div className="relative size-[100px]">
      <div className="absolute bg-gradient-to-b from-[#FF9800] to-[#F57C00] left-0 rounded-[15px] size-[100px] top-0" />
      <p className="absolute font-bold leading-[22px] left-[50px] text-[20px] text-center text-nowrap text-white top-[39px] translate-x-[-50%] whitespace-pre">
        TODO
      </p>
    </div>
  );
}

// Компонент иконки для пар (фиолетовый градиент)
function PairsIcon() {
  return (
    <div className="relative size-[100px]">
      <div className="absolute bg-gradient-to-b from-[#AB47BC] to-[#8E24AA] left-0 rounded-[15px] size-[100px] top-0" />
      <p className="absolute font-bold leading-[22px] left-[50px] text-[20px] text-center text-nowrap text-white top-[39px] translate-x-[-50%] whitespace-pre">
        PAIR
      </p>
    </div>
  );
}

// Компонент иконки для MLS терминала (тёмный градиент)
function MlsTerminalIcon() {
  return (
    <div className="relative size-[100px]">
      <div className="absolute bg-gradient-to-b from-[#111827] to-[#0B1220] left-0 rounded-[15px] size-[100px] top-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="h-7 w-10 rounded-md border border-white/70 bg-black/20 px-1 py-1">
          <div className="text-[9px] font-semibold tracking-wide text-white/90">
            &gt;_
          </div>
        </div>
        <div className="font-bold leading-[22px] text-[18px] text-center text-white">
          MLS
        </div>
      </div>
    </div>
  );
}

export function MainMenu({ onNavigate }: MainMenuProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Шапка */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Логотип слева */}
          <div className="w-10 h-10">
            <ImageWithFallback
              src={logoImage}
              alt="Логотип"
              className="w-full h-full object-contain"
            />
          </div>

          {/* Информация о пользователе справа */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-gray-900">Пётр Иванов</div>
              <div className="text-sm text-gray-500">Агент</div>
            </div>
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBlcnNvbiUyMGF2YXRhcnxlbnwxfHx8fDE3NTk1NDc5MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Пётр Иванов"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Основные разделы - центрированные */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-8">
          {/* Покупатели */}
          <button
            onClick={() => onNavigate("buyers")}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group flex flex-col items-center"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <BuyersIcon />
            </div>
            <div className="text-gray-900 text-center">Покупатели</div>
            <div className="text-sm text-gray-500 text-center mt-1">
              Управление клиентами
            </div>
          </button>

          {/* Продавцы */}
          <button
            onClick={() => onNavigate("sellers")}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all group flex flex-col items-center"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <SellersIcon />
            </div>
            <div className="text-gray-900 text-center">Продавцы</div>
            <div className="text-sm text-gray-500 text-center mt-1">
              Объекты недвижимости
            </div>
          </button>

          {/* Задачи */}
          <button
            onClick={() => onNavigate("tasks")}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all group flex flex-col items-center"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <TasksIcon />
            </div>
            <div className="text-gray-900 text-center">Задачи</div>
            <div className="text-sm text-gray-500 text-center mt-1">
              Планирование и контроль
            </div>
          </button>

          {/* Пары */}
          <button
            onClick={() => onNavigate("pairs")}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all group flex flex-col items-center"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <PairsIcon />
            </div>
            <div className="text-gray-900 text-center">Пары</div>
            <div className="text-sm text-gray-500 text-center mt-1">
              Таблица совпадений
            </div>
          </button>

          {/* MLS Терминал */}
          <button
            onClick={() => onNavigate("mls-terminal")}
            className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all group flex flex-col items-center col-span-2 md:col-span-1"
          >
            <div className="mb-4 group-hover:scale-110 transition-transform">
              <MlsTerminalIcon />
            </div>
            <div className="text-gray-900 text-center">МЛС Терминал</div>
            <div className="text-sm text-gray-500 text-center mt-1">
              Новая версия задач
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
