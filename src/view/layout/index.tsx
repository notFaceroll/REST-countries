import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function Layout() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  return (
    <div className={theme}>
      <div className="flex flex-col min-h-screen pb-8 dark:bg-very-dark-blue-dark-mode-background bg-very-light-gray-light-mode-background">
        <header className="flex items-center shadow-md h-16 px-4 mb-2 dark:bg-dark-blue-dark-mode-elements ">
          <div className="max-w-[1440px] w-full flex justify-between m-auto text-white px-2">
            <h1 className="dark:text-white text-very-dark-blue-light-mode-text text-xl font-bold">
              Where in the world?
            </h1>
            <button
              className="flex space-x-2 items-center dark:text-white text-very-dark-blue-light-mode-text"
              onClick={() =>
                setTheme((prevTheme) =>
                  prevTheme === "dark" ? "light" : "dark"
                )
              }
            >
              {theme === "dark" ? <Sun /> : <Moon />}
              <span>{theme === "dark" ? "Light" : "Dark"} Mode</span>
            </button>
          </div>
        </header>
        <Outlet />
      </div>
    </div>
  );
}
