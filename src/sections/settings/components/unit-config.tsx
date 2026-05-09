import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { useToast } from 'src/components/toast';
import { EmptyData } from 'src/components/empty-data';
import { unitService, UnitData, CreateUnitRequest, UpdateUnitRequest } from 'src/services/unit-service';


export function UnitConfig() {
  const [units, setUnits] = useState<UnitData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [unitToDelete, setUnitToDelete] = useState<UnitData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
  });

  // Load units on component mount
  useEffect(() => {
    loadUnits();
  }, []);

  const loadUnits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await unitService.getUnits();
      setUnits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load units');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingUnit(null);
    setFormData({ code: '', name: '' });
    setDialogOpen(true);
  };

  const handleEdit = (unit: UnitData) => {
    setEditingUnit(unit);
    setFormData({ code: unit.code, name: unit.name });
    setDialogOpen(true);
  };

  const handleDelete = (unit: UnitData) => {
    setUnitToDelete(unit);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (unitToDelete) {
      try {
        setSubmitting(true);
        await unitService.deleteUnit(unitToDelete.id);
        setUnits(units.filter(unit => unit.id !== unitToDelete.id));
        setDeleteDialogOpen(false);
        setUnitToDelete(null);
        toast.showSuccess('Xóa đơn vị tính thành công!');
      } catch (err) {
        toast.showError(err instanceof Error ? err.message : 'Failed to delete unit');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setUnitToDelete(null);
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      if (editingUnit) {
        // Update existing unit
        const updateData: UpdateUnitRequest = formData;
        const updatedUnit = await unitService.updateUnit(editingUnit.id, updateData);
        setUnits(units.map(unit => 
          unit.id === editingUnit.id ? updatedUnit : unit
        ));
        toast.showSuccess('Cập nhật đơn vị tính thành công!');
      } else {
        // Add new unit
        const createData: CreateUnitRequest = formData;
        const newUnit = await unitService.createUnit(createData);
        setUnits([...units, newUnit]);
        toast.showSuccess('Thêm đơn vị tính thành công!');
      }
      
      setDialogOpen(false);
      setEditingUnit(null);
      setFormData({ code: '', name: '' });
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Failed to save unit');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingUnit(null);
    setFormData({ code: '', name: '' });
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Cấu hình đơn vị tính
          </Typography>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={handleAdd}
            disabled={loading}
          >
            Thêm mới
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
            <Button onClick={loadUnits} sx={{ ml: 1 }}>Thử lại</Button>
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : units.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EmptyData
              title="Không có đơn vị tính tài sản nào"
              description="Chưa có dữ liệu đơn vị tính tài sản nào. Hãy bắt đầu bằng cách thêm đơn vị tính đầu tiên."
              icon="solar:document-text-outline"
              action={{
                text: 'Thêm đơn vị tính',
                onClick: () => console.log('Add unit'),
              }}
            />
          </Box>
        ) : (
          <Scrollbar>
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 'bold' }}>Mã</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {units.map((unit) => (
                    <TableRow key={unit.id} hover>
                      <TableCell>{unit.code}</TableCell>
                      <TableCell>{unit.name}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(unit)}
                          sx={{ mr: 1 }}
                        >
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(unit)}
                          color="error"
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>
        )}
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingUnit ? 'Chỉnh sửa đơn vị tính' : 'Thêm đơn vị tính mới'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Mã đơn vị"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                placeholder="Ví dụ: VND, USD, CHI"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Tên đơn vị"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ví dụ: Việt Nam Đồng, Đô la Mỹ, Chỉ vàng"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
            {submitting ? (
              <CircularProgress size={20} sx={{ mr: 1 }} />
            ) : null}
            {editingUnit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa đơn vị tính "${unitToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        severity="error"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Card>
  );
}
