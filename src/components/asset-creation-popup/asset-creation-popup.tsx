import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { AssetTypeSelector, EWalletSelector, AssetType, assetTypes } from '../asset-type-selector';

interface AssetCreationPopupProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssetFormData) => void;
}

export interface AssetFormData {
  assetType: string;
  eWalletType?: string;
  quantity: number;
  unit: string;
  price: number;
  totalAmount: number;
  source: string;
  status: string;
  acquisitionDate: Date | null;
  description: string;
  image?: File;
}

const assetStatuses = [
  { value: 'BORROWED', label: 'Cho mượn' },
  { value: 'LENT', label: 'Cho vay' },
  { value: 'PAWNED', label: 'Cầm cố' },
  { value: 'HELD', label: 'Đang giữ' },
];

export function AssetCreationPopup({ open, onClose, onSubmit }: AssetCreationPopupProps) {
  const [formData, setFormData] = useState<AssetFormData>({
    assetType: '',
    quantity: 1,
    unit: '',
    price: 0,
    totalAmount: 0,
    source: '',
    status: 'HELD',
    acquisitionDate: new Date(),
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AssetFormData, string>>>({});
  const [imagePreview, setImagePreview] = useState<string>('');

  const selectedAssetType = formData.assetType;

  // Auto-calculate total amount
  useEffect(() => {
    if (selectedAssetType === 'MONEY') {
      setFormData(prev => ({
        ...prev,
        quantity: 1,
        totalAmount: prev.price,
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        totalAmount: prev.quantity * prev.price,
      }));
    }
  }, [formData.quantity, formData.price, selectedAssetType]);

  const handleAssetTypeChange = (assetType: string) => {
    const selectedType = assetTypes.find((type: AssetType) => type.code === assetType);
    setFormData(prev => ({
      ...prev,
      assetType,
      unit: selectedType?.unit || '',
      quantity: assetType === 'MONEY' ? 1 : prev.quantity,
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof AssetFormData, string>> = {};

    if (!formData.assetType) {
      newErrors.assetType = 'Vui lòng chọn loại tài sản';
    }
    if (formData.assetType !== 'MONEY' && formData.quantity <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    }
    if (formData.price <= 0) {
      newErrors.price = 'Giá phải lớn hơn 0';
    }
    if (!formData.source.trim()) {
      newErrors.source = 'Vui lòng nhập nguồn gốc tài sản';
    }
    if (!formData.status) {
      newErrors.status = 'Vui lòng chọn trạng thái';
    }
    if (!formData.acquisitionDate) {
      newErrors.acquisitionDate = 'Vui lòng chọn ngày nhận/mua';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      assetType: '',
      quantity: 1,
      unit: '',
      price: 0,
      totalAmount: 0,
      source: '',
      status: 'HELD',
      acquisitionDate: new Date(),
      description: '',
    });
    setErrors({});
    setImagePreview('');
    onClose();
  };

  return (
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Thêm tài sản mới</Typography>
            <IconButton onClick={handleClose}>
              <Iconify icon={"mdi:close" as any} />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
            <Grid container spacing={3}>
            {/* Loại tài sản */}
            <Grid size={{ xs: 12 }}>
              <AssetTypeSelector
                value={formData.assetType}
                onChange={handleAssetTypeChange}
                error={!!errors.assetType}
                helperText={errors.assetType}
              />
            </Grid>

            {/* Ví điện tử - chỉ hiện khi chọn loại tài sản là ví điện tử */}
            {selectedAssetType === 'EWALLET' && (
              <Grid size={{ xs: 12 }}>
                <EWalletSelector
                  value={formData.eWalletType || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, eWalletType: value }))}
                  error={!!errors.eWalletType}
                  helperText={errors.eWalletType}
                />
              </Grid>
            )}

            {/* Số lượng - không hiện với tiền mặt */}
            {selectedAssetType !== 'MONEY' && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Số lượng"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                  error={!!errors.quantity}
                  helperText={errors.quantity}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid>
            )}

            {/* Đơn vị */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Đơn vị"
                value={formData.unit}
                disabled
                helperText="Tự động lấy theo loại tài sản"
              />
            </Grid>

            {/* Giá/Giá trị */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label={selectedAssetType === 'MONEY' ? 'Giá trị' : 'Giá'}
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                error={!!errors.price}
                helperText={errors.price}
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>

            {/* Thành tiền */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Thành tiền"
                value={formData.totalAmount.toLocaleString('vi-VN')}
                disabled
                helperText="Tự động tính theo số lượng × giá"
              />
            </Grid>

            {/* Nguồn gốc tài sản */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Nguồn gốc tài sản"
                placeholder="Ví dụ: mua tại cửa hàng vàng ABC, nhận lương..."
                value={formData.source}
                onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                error={!!errors.source}
                helperText={errors.source}
              />
            </Grid>

            {/* Trạng thái */}
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  label="Trạng thái"
                >
                  {assetStatuses.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* Ngày nhận/mua tài sản */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Ngày nhận/mua tài sản"
                type="date"
                value={formData.acquisitionDate ? formData.acquisitionDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData(prev => ({ ...prev, acquisitionDate: e.target.value ? new Date(e.target.value) : null }))}
                error={!!errors.acquisitionDate}
                helperText={errors.acquisitionDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Mô tả/Ghi chú */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mô tả/Ghi chú"
                multiline
                rows={3}
                placeholder="Nhập mô tả hoặc ghi chú về tài sản..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>

            {/* Hình ảnh */}
            <Grid size={{ xs: 12 }}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Hình ảnh tài sản (tùy chọn)
                </Typography>
                <input
                  accept="image/*"
                  id="asset-image-upload"
                  type="file"
                  hidden
                  onChange={handleImageUpload}
                />
                <label htmlFor="asset-image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<Iconify icon={"mdi:upload" as any} />}
                    sx={{ mb: 2 }}
                  >
                    Tải lên hình ảnh
                  </Button>
                </label>

                {imagePreview && (
                  <Box sx={{ mt: 2 }}>
                    <img
                      src={imagePreview}
                      alt="Asset preview"
                      style={{
                        maxWidth: '200px',
                        maxHeight: '200px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Stack direction="row" spacing={2} sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              Hủy
            </Button>
            <Button onClick={handleSubmit} variant="contained" startIcon={<Iconify icon={"mdi:check" as any} />}>
              Lưu tài sản
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
  );
}
