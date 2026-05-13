import { useTranslation } from 'react-i18next';
import { useState } from 'react';

import {
  Box,
  Button,
  alpha,
  useTheme,
  Fade,
  Fab,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import type { AssetQuickAction } from 'src/types/asset-detail';

interface AssetQuickActionProps {
  actions: AssetQuickAction[];
  onActionClick: (action: AssetQuickAction['action']) => void;
  disabled?: boolean;
  isMobile?: boolean;
}

export function AssetQuickAction({ 
  actions, 
  onActionClick, 
  disabled = false,
  isMobile = false 
}: AssetQuickActionProps) {
  const { t } = useTranslation('assetDetail');
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionClick = (action: AssetQuickAction['action']) => {
    onActionClick(action);
    handleMenuClose();
  };

  const getActionIcon = (action: AssetQuickAction['action']) => {
    switch (action) {
      case 'buy':
        return 'solar:cart-add-bold';
      case 'sell':
        return 'solar:cart-remove-bold';
      case 'update_price':
        return 'solar:refresh-circle-bold';
      case 'view_history':
        return 'solar:clock-circle-bold';
      case 'transfer':
        return 'solar:arrow-right-up-bold';
      default:
        return 'solar:more-circle-bold';
    }
  };

  const getActionColor = (action: AssetQuickAction['action']) => {
    switch (action) {
      case 'buy':
        return theme.palette.success.main;
      case 'sell':
        return theme.palette.error.main;
      case 'update_price':
        return theme.palette.info.main;
      case 'view_history':
        return theme.palette.primary.main;
      case 'transfer':
        return theme.palette.warning.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Desktop: Floating side action
  if (!isMobile) {
    return (
      <Fade in={!disabled} timeout={800}>
        <Box
          sx={{
            position: 'sticky',
            top: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            p: 2,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: theme.shadows[4],
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
            {t('quickActions.title')}
          </Typography>
          
          {actions.map((action) => (
            <Tooltip key={action.id} title={action.label} placement="left">
              <Button
                variant="outlined"
                size="small"
                startIcon={
                  <Iconify 
                    icon={getActionIcon(action.action) as any} 
                    width={16} 
                    sx={{ color: getActionColor(action.action) }}
                  />
                }
                onClick={() => handleActionClick(action.action)}
                disabled={action.disabled || disabled}
                sx={{
                  justifyContent: 'flex-start',
                  px: 2,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: alpha(getActionColor(action.action), 0.3),
                  color: getActionColor(action.action),
                  '&:hover': {
                    backgroundColor: alpha(getActionColor(action.action), 0.1),
                    borderColor: getActionColor(action.action),
                  },
                  '&:disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                {action.label}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Fade>
    );
  }

  // Mobile: Sticky bottom action
  return (
    <Fade in={!disabled} timeout={800}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          zIndex: theme.zIndex.fab - 1,
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          {actions.slice(0, 3).map((action) => (
            <Button
              key={action.id}
              variant="contained"
              size="small"
              startIcon={
                <Iconify 
                  icon={getActionIcon(action.action) as any} 
                  width={16} 
                />
              }
              onClick={() => handleActionClick(action.action)}
              disabled={action.disabled || disabled}
              sx={{
                flex: 1,
                backgroundColor: getActionColor(action.action),
                '&:hover': {
                  backgroundColor: alpha(getActionColor(action.action), 0.8),
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              {action.label}
            </Button>
          ))}
        </Box>

        {/* More actions menu */}
        {actions.length > 3 && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<Iconify icon={("solar:more-circle-bold" as any)} width={16} />}
              onClick={handleMenuOpen}
              disabled={disabled}
              sx={{
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.main,
                },
              }}
            >
              {t('quickActions.moreActions')}
            </Button>
          </Box>
        )}

        {/* Menu for additional actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              p: 1,
              minWidth: 200,
              borderRadius: 3,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            },
          }}
        >
          {actions.slice(3).map((action) => (
            <MenuItem
              key={action.id}
              onClick={() => handleActionClick(action.action)}
              disabled={action.disabled || disabled}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&:hover': {
                  backgroundColor: alpha(getActionColor(action.action), 0.1),
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              <ListItemIcon>
                <Iconify 
                  icon={getActionIcon(action.action) as any} 
                  width={20} 
                  sx={{ color: getActionColor(action.action) }}
                />
              </ListItemIcon>
              <ListItemText
                primary={action.label}
                primaryTypographyProps={{
                  fontSize: '14px',
                  fontWeight: 500,
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Fade>
  );
}
