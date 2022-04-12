import React, { useContext, useState, createContext } from "react";

const PriceContext = createContext();
const PriceUpdateContext = createContext();

export function useTheme() {
  return useContext(PriceContext);
}

export function useThemeUpdate() {
  return useContext(PriceUpdateContext);
}

export function ThemeProvider({ children }) {
  const [darkTheme, setDarkTheme] = useState(true);

  function toggleTheme() {
    setDarkTheme((prevDarkTheme) => !prevDarkTheme);
  }

  return (
    <PriceContext.Provider value={darkTheme}>
      <PriceUpdateContext.Provider value={toggleTheme}>
        {children}
      </PriceUpdateContext.Provider>
    </PriceContext.Provider>
  );
}
