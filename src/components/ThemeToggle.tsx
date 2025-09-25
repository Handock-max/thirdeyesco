import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

// Composant pour basculer entre les thèmes
const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  // Fonction pour basculer au thème suivant
  const toggleTheme = () => {
    switch (theme) {
      case 'light':
        setTheme('dark');
        break;
      case 'dark':
        setTheme('system');
        break;
      case 'system':
        setTheme('light');
        break;
      default:
        setTheme('light');
    }
  };

  // Fonction pour obtenir l'icône du thème actuel
  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />;
      case 'dark':
        return <Moon className="w-4 h-4" />;
      case 'system':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Sun className="w-4 h-4" />;
    }
  };

  // Fonction pour obtenir le texte du thème actuel
  const getThemeText = () => {
    switch (theme) {
      case 'light':
        return 'Clair';
      case 'dark':
        return 'Sombre';
      case 'system':
        return 'Système';
      default:
        return 'Clair';
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
      title={`Thème actuel: ${getThemeText()}. Cliquez pour changer.`}
    >
      {getThemeIcon()}
      <span className="hidden sm:inline">{getThemeText()}</span>
    </Button>
  );
};

export default ThemeToggle;
