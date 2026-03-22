import { format, isToday, isTomorrow } from "date-fns";
import { hu } from "date-fns/locale";

export function formatDate(date: string | Date) {
  return format(new Date(date), "yyyy.MM.dd", { locale: hu });
}

export function agendaGroupLabel(date: string | Date) {
  const parsed = new Date(date);
  if (isToday(parsed)) return "Ma";
  if (isTomorrow(parsed)) return "Holnap";
  return format(parsed, "EEEE", { locale: hu });
}
