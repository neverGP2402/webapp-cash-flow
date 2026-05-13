import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Stack,
  useTheme,
  alpha,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface ConfirmActionModalProps {
  open: boolean;
  title: string;
  description: string;
  actionText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionModal({
  open,
  title,
  description,
  actionText,
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Iconify icon="solar:shield-warning-bold" width={24} color={theme.palette.warning.main} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography variant="body1" color="text.secondary">
          {description}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Hủy
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ borderRadius: 2 }}
        >
          {actionText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
