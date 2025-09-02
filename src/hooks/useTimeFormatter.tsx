import { formatDistanceToNow } from "date-fns";
import { ptBR, enUS, es, fr, de, it, ja, ko, zhCN, ar, ru, hi } from "date-fns/locale";
import { useLanguage } from "./useLanguage";

const locales = {
  pt: ptBR,
  en: enUS,
  es: es,
  fr: fr,
  de: de,
  it: it,
  ja: ja,
  ko: ko,
  zh: zhCN,
  ar: ar,
  ru: ru,
  hi: hi,
};

export const useTimeFormatter = () => {
  const { language } = useLanguage();
  
  const formatTimeAgo = (date: string | Date) => {
    const locale = locales[language] || locales.en;
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale,
    });
  };
  
  return { formatTimeAgo };
};