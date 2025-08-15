import { Moon, Sun } from "lucide-react";
import Button from "./ui/Button";
import { useTheme } from "../store/theme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="outline" onClick={toggle} className="gap-2" aria-label="Alternar tema">
      {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />} {theme === "dark" ? "Claro" : "Escuro"}
    </Button>
  );
}
