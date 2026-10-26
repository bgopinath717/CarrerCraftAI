import React, { createContext, useContext, useEffect } from 'react';

const ThemeContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }) => {
  useEffect(() => {
    // Permanently enforce light theme across the document
    const root = document.documentElement;
    root.removeAttribute('data-theme');
    localStorage.removeItem('careercraft_theme');
  }, []);

  return (
    <ThemeContext.Provider value={{ isDarkMode: false, toggleTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
