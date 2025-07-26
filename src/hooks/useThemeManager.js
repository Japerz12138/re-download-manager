import { useEffect } from 'react';
import { settingsChangedEvent } from '../pages/settings';

export function useThemeManager(theme, setTheme) {
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await window.electron.getSettings();
        setTheme(response.theme);
        document.documentElement.style.setProperty('--main-color', response.color);
      } catch (error) {
        console.error('Error fetching theme from settings:', error);
      }
    };
    fetchTheme();

    window.addEventListener('focus', handleWindowFocus);

    const handleSettingsChange = ({ setting, value }) => {
      if (setting === 'theme') {
        setTheme(value);
      }
    };

    settingsChangedEvent.on('settingsChanged', handleSettingsChange);

    return () => {
      window.removeEventListener('focus', handleWindowFocus);
      settingsChangedEvent.off('settingsChanged', handleSettingsChange);
    };
  }, [setTheme]);

  useEffect(() => {
    if (theme === 'Dark') {
      const htmlElement = document.querySelector('html');
      htmlElement.setAttribute('data-bs-theme', 'dark');
    } else {
      const htmlElement = document.querySelector('html');
      htmlElement.setAttribute('data-bs-theme', 'light');
    }
  }, [theme]);

  const handleWindowFocus = () => {
    //checkClipboard();
  };
} 