import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Fab,
  Box,
  Zoom,
  Paper,
  Typography,
  ClickAwayListener,
  useTheme,
  alpha,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onAddTransaction?: () => void;
  onAddWallet?: () => void;
  onAddAsset?: () => void;
  onAddDebt?: () => void;
  onAddGoal?: () => void;
}

export function QuickActions({
  onAddTransaction,
  onAddWallet,
  onAddAsset,
  onAddDebt,
  onAddGoal,
}: QuickActionsProps) {
  const { t } = useTranslation('dashboard');
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const actions: QuickAction[] = [
    {
      id: 'transaction',
      label: t('quickActions.addTransaction'),
      icon: 'solar:arrow-left-right-bold',
      color: theme.palette.success.main,
      onClick: onAddTransaction || (() => {}),
    },
    {
      id: 'wallet',
      label: t('quickActions.addWallet'),
      icon: 'solar:wallet-bold',
      color: theme.palette.info.main,
      onClick: onAddWallet || (() => {}),
    },
    {
      id: 'asset',
      label: t('quickActions.addAsset'),
      icon: 'solar:graph-up-bold',
      color: theme.palette.warning.main,
      onClick: onAddAsset || (() => {}),
    },
    {
      id: 'debt',
      label: t('quickActions.addDebt'),
      icon: 'solar:danger-circle-bold',
      color: theme.palette.error.main,
      onClick: onAddDebt || (() => {}),
    },
    {
      id: 'goal',
      label: t('quickActions.addGoal'),
      icon: 'solar:target-bold',
      color: theme.palette.primary.main,
      onClick: onAddGoal || (() => {}),
    },
  ];

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      event.type === 'touchstart' ||
      (event.target as Element).closest('.quick-action-item')
    ) {
      return;
    }
    setOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'center',
          gap: 2,
        }}
      >
        {/* Action Items */}
        {actions.map((action, index) => (
          <Zoom
            key={action.id}
            in={open}
            style={{
              transitionDelay: open ? `${index * 50}ms` : '0ms',
            }}
          >
            <Box
              className="quick-action-item"
              sx={{
                display: open ? 'flex' : 'none',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                borderRadius: 3,
                bgcolor: 'background.paper',
                boxShadow: theme.shadows[4],
                border: `1px solid ${alpha(action.color, 0.2)}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: alpha(action.color, 0.08),
                  transform: 'translateX(-4px)',
                },
              }}
              onClick={() => {
                action.onClick();
                setOpen(false);
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 2,
                  bgcolor: alpha(action.color, 0.12),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon={action.icon as any} width={18} color={action.color} />
              </Box>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {action.label}
              </Typography>
            </Box>
          </Zoom>
        ))}

        {/* Main FAB */}
        <Fab
          color="primary"
          onClick={handleToggle}
          sx={{
            width: 56,
            height: 56,
            boxShadow: theme.shadows[6],
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: theme.shadows[8],
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Iconify
            icon={(open ? 'eva:close-fill' : 'mingcute:add-line') as any}
            width={28}
            sx={{
              transition: 'transform 0.3s ease',
              transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </Fab>
      </Box>
    </ClickAwayListener>
  );
}