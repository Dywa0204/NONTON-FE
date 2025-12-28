import React, { createContext, useState, ReactNode } from "react";
import { THEME } from "../constants";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

const initialState = {
  theme: THEME.DEFAULT,
  setTheme: (theme: string) => {},
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState(initialState.theme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
