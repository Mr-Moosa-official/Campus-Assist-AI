import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Languages } from 'lucide-react';

type HeaderProps = {
  language: string;
  onLanguageChange: (lang: string) => void;
};

export default function Header({ language, onLanguageChange }: HeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 border-b bg-card shadow-sm shrink-0">
      <h1 className="text-xl font-bold md:text-2xl font-headline text-foreground">
        CampusAssist AI
      </h1>
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 text-muted-foreground" />
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[120px] focus:ring-ring focus:ring-2">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="fr">Français</SelectItem>
            <SelectItem value="de">Deutsch</SelectItem>
            <SelectItem value="zh">中文</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </header>
  );
}
