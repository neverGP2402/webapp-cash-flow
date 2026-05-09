import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  IconButton,
  Avatar,
  LinearProgress
} from '@mui/material';
import { useAppTranslation } from 'src/hooks/use-translation';

interface SuccessPopupProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  onConfirm?: () => void;
  autoClose?: boolean;
  confirmText?: string;
}

export function SuccessPopup({
  open,
  onClose,
  title,
  message,
  onConfirm,
  autoClose = true,
  confirmText = 'OK'
}: SuccessPopupProps) {
  const [progress, setProgress] = useState(0);
  const { t } = useAppTranslation();

  useEffect(() => {
    if (autoClose && open) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) return prev;
          return prev + 1;
        });
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(timer);
        setProgress(100);
        setTimeout(() => {
          onClose();
        }, 500);
      }, 5000);

      return () => {
        clearInterval(timer);
        clearTimeout(timeout);
      };
    }
  }, [open, autoClose, onClose]);

  const handleClose = () => {
    setProgress(0);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        }
      }}
    >
      <DialogContent sx={{ p: 0, '&:first-child': { p: 0 } }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          p: 3,
          minWidth: 300
        }}>
          {/* Success Icon */}
          <Avatar 
            sx={{ 
              bgcolor: 'success.main', 
              color: 'white', 
              mb: 2,
              width: 60,
              height: 60,
              fontSize: '24px',
              fontFamily: 'monospace'
            }}
          >
            ✓
          </Avatar>

          {/* Title */}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              textAlign: 'center', 
              mb: 1,
              fontWeight: 600,
              color: 'text.primary'
            }}
          >
            {title || t('common.success')}
          </Typography>

          {/* Message */}
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center', 
              color: 'text.secondary',
              mb: 3
            }}
          >
            {message}
          </Typography>

          {/* Progress Bar */}
          {autoClose && (
            <Box sx={{ width: '100%', mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ 
                  height: 4,
                  borderRadius: 2,
                  bgcolor: 'action.disabled'
                }}
              />
              <Typography 
                variant="caption" 
                sx={{ 
                  textAlign: 'center', 
                  mt: 1,
                  color: 'text.secondary'
                }}
              >
                {progress}%
              </Typography>
            </Box>
          )}
        </Box>

        {/* Close Button */}
        <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
          <Button 
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ minWidth: 100 }}
          >
            {confirmText}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
