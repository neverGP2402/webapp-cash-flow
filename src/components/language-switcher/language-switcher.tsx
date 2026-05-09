import { useState } from 'react';
import { Select, MenuItem, Box, Typography, Avatar } from '@mui/material';
import { useAppTranslation, SUPPORTED_LANGUAGES, SupportedLanguage } from 'src/hooks/use-translation';
import { _langs } from 'src/_mock/_data';

/**
 * Language Switcher Component
 * Follows Single Responsibility Principle: Only handles language switching
 * Follows Open/Closed Principle: Can be extended without modification
 * Follows Dependency Inversion: Depends on abstractions (translation hooks)
 */
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'button';
  size?: 'small' | 'medium';
  showFlag?: boolean;
  sx?: object;
}

export function LanguageSwitcher({ 
  variant = 'dropdown', 
  size = 'small',
  showFlag = true,
  sx = {}
}: LanguageSwitcherProps) {
  const { currentLanguage, changeLanguage, supportedLanguages } = useAppTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (event: any) => {
    const newLanguage = event.target.value as SupportedLanguage;
    changeLanguage(newLanguage);
    setIsOpen(false);
    // Save to localStorage to persist across page reloads
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  // Filter langs to only include supported languages
  const availableLangs = _langs.filter(lang => 
    Object.keys(supportedLanguages).includes(lang.value)
  );

  if (variant === 'button') {
    return (
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', ...sx }}>
        {availableLangs.map((lang) => (
          <Box
            key={lang.value}
            onClick={() => changeLanguage(lang.value as SupportedLanguage)}
            sx={{
              px: 2,
              py: 1,
              borderRadius: 1,
              cursor: 'pointer',
              backgroundColor: currentLanguage === lang.value ? 'primary.main' : 'transparent',
              color: currentLanguage === lang.value ? 'primary.contrastText' : 'text.primary',
              '&:hover': {
                backgroundColor: currentLanguage === lang.value ? 'primary.dark' : 'action.hover',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {showFlag && (
              <Avatar 
                src={lang.icon} 
                alt={lang.label}
                sx={{ width: 20, height: 20, mr: 1 }}
              >
                {supportedLanguages[lang.value as SupportedLanguage]?.flag}
              </Avatar>
            )}
            <Typography variant={size === 'small' ? 'caption' : 'body2'}>
              {lang.label}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }

  return (
    <Select
      value={currentLanguage}
      onChange={handleLanguageChange}
      size={size}
      sx={{
        minWidth: 120,
        ...sx,
      }}
      renderValue={(value) => {
        const lang = availableLangs.find(l => l.value === value);
        const config = supportedLanguages[value as SupportedLanguage];
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showFlag && (
              <Avatar 
                src={lang?.icon} 
                alt={lang?.label}
                sx={{ width: 20, height: 20 }}
              >
                {config?.flag}
              </Avatar>
            )}
            <Typography variant="body2">
              {lang?.label}
            </Typography>
          </Box>
        );
      }}
    >
      {availableLangs.map((lang) => (
        <MenuItem key={lang.value} value={lang.value}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {showFlag && (
              <Avatar 
                src={lang.icon} 
                alt={lang.label}
                sx={{ width: 20, height: 20 }}
              >
                {supportedLanguages[lang.value as SupportedLanguage]?.flag}
              </Avatar>
            )}
            <Typography variant="body2">
              {lang.label}
            </Typography>
          </Box>
        </MenuItem>
      ))}
    </Select>
  );
}
