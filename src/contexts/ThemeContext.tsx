import React, { createContext, useContext, useEffect, useState } from 'react';

// Types pour le contexte de thème
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  actualTheme: 'light' | 'dark'; // Thème réel appliqué (résout 'system')
}

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider');
  }
  return context;
};

// Props pour le ThemeProvider
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: 'light' | 'dark' | 'system';
  storageKey?: string;
}

// Provider du contexte de thème
export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'system',
  storageKey = 'thirdeyesco-theme',
}) => {
  // État pour le thème sélectionné par l'utilisateur
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>(() => {
    // Récupération du thème depuis le localStorage
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as 'light' | 'dark' | 'system') || defaultTheme;
    }
    return defaultTheme;
  });

  // Fonction pour résoudre le thème système
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Thème réel appliqué (résout 'system')
  const actualTheme = theme === 'system' ? getSystemTheme() : theme;

  // Fonction pour appliquer le thème au document
  const applyTheme = (newTheme: 'light' | 'dark') => {
    const root = window.document.documentElement;
    
    // Suppression des classes de thème existantes
    root.classList.remove('light', 'dark');
    
    // Ajout de la nouvelle classe de thème
    root.classList.add(newTheme);
    
    // Mise à jour de l'attribut data-theme pour les composants
    root.setAttribute('data-theme', newTheme);
  };

  // Fonction pour gérer le changement de thème
  const handleSetTheme = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    
    // Sauvegarde dans le localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
  };

  // Effet pour appliquer le thème au montage et aux changements
  useEffect(() => {
    applyTheme(actualTheme);
  }, [actualTheme]);

  // Effet pour écouter les changements de préférence système
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        applyTheme(getSystemTheme());
      };

      // Écoute des changements de préférence système
      mediaQuery.addEventListener('change', handleChange);
      
      // Nettoyage de l'écouteur
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Valeur du contexte
  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    actualTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
