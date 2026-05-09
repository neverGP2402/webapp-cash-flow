import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content?: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  onConfirm: () => void;
  onCancel: () => void;
}

const severityColors = {
  info: 'primary.main',
  warning: 'warning.main',
  error: 'error.main',
  success: 'success.main',
};

const severityIcons = {
  info: 'solar:info-circle-bold',
  warning: 'solar:warning-circle-bold',
  error: 'solar:danger-circle-bold',
  success: 'solar:check-circle-bold',
};

export function ConfirmDialog({
  open,
  title = 'Xác nhận',
  content = 'Bạn có chắc chắn muốn thực hiện hành động này?',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  severity = 'warning',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Iconify 
            icon={severityIcons[severity] as any} 
            sx={{ color: severityColors[severity] }} 
          />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="text.secondary">
          {content}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="inherit">
          {cancelText}
        </Button>
        <Button 
          onClick={onConfirm} 
          variant="contained" 
          color={severity === 'error' ? 'error' : 'primary'}
          autoFocus
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
