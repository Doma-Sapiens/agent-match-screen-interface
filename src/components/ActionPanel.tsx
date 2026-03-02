import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Eye, Clock, DollarSign } from "lucide-react";

export function ActionPanel() {
  return (
    <div className="w-64">
      {/* Статистика */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-gray-900 text-sm">Статистика</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm">Проведено показов:</span>
            </div>
            <span className="text-gray-900 text-sm">3</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 text-sm">Назначено:</span>
            </div>
            <span className="text-gray-900 text-sm">1</span>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-gray-600 text-sm">Потенциал:</span>
            </div>
            <span className="text-green-600 text-sm">12 000 000 ₽</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}