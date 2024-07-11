import React from "react";
import ReplyAssistant from "./ReplyAssistant";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeSwitcher from "./components/ThemeToggle";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="p-4 flex justify-end">
          <ThemeSwitcher />
        </div>
        <ReplyAssistant />
      </div>
    </ThemeProvider>
  );
};

export default App;
