import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography, Button, IconButton, styled, alpha } from '@mui/material';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

interface BillUploadProps {
  image?: File | string | null;
  onImageChange: (image: File | null) => void;
}

const UploadContainer = styled(Box)<{ hasImage: boolean }>(({ theme, hasImage }) => ({
  border: `2px dashed ${theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  padding: theme.spacing(3),
  textAlign: 'center',
  backgroundColor: hasImage ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  minHeight: 120,
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderColor: theme.palette.primary.main,
  },
}));

const UploadIcon = styled(Box)(({ theme }) => ({
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const PreviewImage = styled('img')(({ theme }) => ({
  width: '100%',
  maxHeight: 200,
  borderRadius: theme.spacing(1),
  objectFit: 'cover',
}));

const RemoveButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
  backgroundColor: alpha(theme.palette.common.black, 0.6),
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.8),
  },
}));

// ----------------------------------------------------------------------

export function BillUpload({ image, onImageChange }: BillUploadProps) {
  const { t } = useTranslation('common');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  }, [onImageChange]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageChange(file);
    }
  }, [onImageChange]);

  const handleRemoveImage = useCallback(() => {
    onImageChange(null);
  }, [onImageChange]);

  const getImageUrl = () => {
    if (image instanceof File) {
      return URL.createObjectURL(image);
    }
    return image as string;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
        {t('transactionHistory.receipt')}
      </Typography>
      
      <UploadContainer
        hasImage={!!image}
        onClick={() => document.getElementById('file-input')?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {image ? (
          <Box sx={{ position: 'relative' }}>
            <PreviewImage
              src={getImageUrl()}
              alt="Bill preview"
            />
            <RemoveButton onClick={handleRemoveImage} size="small">
              <Iconify icon="solar:cart-3-bold" width={16} />
            </RemoveButton>
          </Box>
        ) : (
          <Box>
            <UploadIcon>
              <Iconify icon="solar:cart-3-bold" width={48} />
            </UploadIcon>
            <Typography variant="body2" color="text.secondary">
              Kéo và thả ảnh hóa đơn hoặc click để chọn file
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (PNG, JPG, JPEG - Tối đa 5MB)
            </Typography>
          </Box>
        )}
        
        <input
          id="file-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </UploadContainer>
    </Box>
  );
}
