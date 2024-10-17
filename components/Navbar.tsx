import { Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";

export const Navbar = ({ onLogout }: { onLogout: () => void }) => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between p-4 bg-background border-b">
      <div className="text-2xl font-bold">Dashboard</div>
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Button onClick={onLogout}>Logout</Button>
      </div>
    </nav>
  );
};
