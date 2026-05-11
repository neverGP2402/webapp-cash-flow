import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  CircularProgress,
  Box,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { useToast } from 'src/components/toast';
import { UnitSelector } from 'src/components/unit-selector';

import type { AssetTypeData, CreateAssetTypeRequest, UpdateAssetTypeRequest } from 'src/services/asset-service';
import { assetService } from 'src/services/asset-service';

const availableIcons = [
  'mdi:cash',
  'mdi:bank',
  'mdi:gold',
  'mdi:bitcoin',
  'mdi:package-variant',
];

const assetTypeLabels = {
  PHYSICAL: 'Tài sản vật lý',
  DIGITAL: 'Tài sản số',
  CASH: 'Tiền mặt',
};

interface AssetTypeDialogProps {
  open: boolean;
  onClose: () => void;
  editingAssetType?: AssetTypeData | null;
  onAssetTypeUpdated?: (updatedAssetType: AssetTypeData) => void;
  onAssetTypeCreated?: (newAssetType: AssetTypeData) => void;
}

export function AssetTypeDialog({
  open,
  onClose,
  editingAssetType,
  onAssetTypeUpdated,
  onAssetTypeCreated,
}: AssetTypeDialogProps) {
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    icon: '',
    unitId: 0,
    type: 'PHYSICAL' as AssetTypeData['type'],
  });

  // Initialize form data when editing
  useEffect(() => {
    if (editingAssetType) {
      setFormData({
        code: editingAssetType.code,
        name: editingAssetType.name,
        icon: editingAssetType.icon,
        unitId: editingAssetType.unit_id,
        type: editingAssetType.type,
      });
    }
  }, [editingAssetType]);

  const handleClose = () => {
    setFormData({ code: '', name: '', icon: '', unitId: 0, type: 'PHYSICAL' });
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      if (editingAssetType) {
        // Update existing asset type
        const updateData: UpdateAssetTypeRequest = {
          code: formData.code,
          name: formData.name,
          icon: formData.icon,
          unit_id: formData.unitId,
          type: formData.type,
        };
        const updatedAssetType = await assetService.updateAssetType(editingAssetType.id, updateData);
        toast.showSuccess('Cập nhật loại tài sản thành công!');
        onAssetTypeUpdated?.(updatedAssetType);
      } else {
        // Add new asset type
        const createData: CreateAssetTypeRequest = {
          code: formData.code,
          name: formData.name,
          icon: formData.icon,
          unit_id: formData.unitId,
          type: formData.type,
        };
        const newAssetType = await assetService.createAssetType(createData);
        toast.showSuccess('Thêm loại tài sản thành công!');
        onAssetTypeCreated?.(newAssetType);
      }
      
      onClose();
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Failed to save asset type');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editingAssetType ? 'Chỉnh sửa loại tài sản' : 'Thêm loại tài sản mới'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Mã loại tài sản"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              placeholder="Ví dụ: MONEY, BANK, GOLD"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Tên loại tài sản"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ví dụ: Tiền mặt, Ngân hàng, Vàng"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Icon</InputLabel>
              <Select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                label="Icon"
              >
                {availableIcons.map((icon) => (
                  <MenuItem key={icon} value={icon}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Iconify icon={icon as any} width={20} sx={{ mr: 1 }} />
                      {icon}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <UnitSelector
              value={formData.unitId}
              onChange={(value) => setFormData(prev => ({ ...prev, unitId: value }))}
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel>Loại tài sản</InputLabel>
              <Select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssetTypeData['type'] }))}
                label="Loại tài sản"
              >
                <MenuItem value="PHYSICAL">Tài sản vật lý</MenuItem>
                <MenuItem value="DIGITAL">Tài sản số</MenuItem>
                <MenuItem value="CASH">Tiền mặt</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Hủy
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? (
            <CircularProgress size={20} sx={{ mr: 1 }} />
          ) : null}
          {editingAssetType ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
