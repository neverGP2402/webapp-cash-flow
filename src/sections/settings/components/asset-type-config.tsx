import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AssetTypeDialog } from 'src/components/asset-type-dialog';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { EmptyData } from 'src/components/empty-data';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { useToast } from 'src/components/toast';
import { assetService, AssetTypeData } from 'src/services/asset-service';

const assetTypeLabels = {
  PHYSICAL: 'Tài sản vật lý',
  DIGITAL: 'Tài sản số',
  CASH: 'Tiền mặt',
};



export function AssetTypeConfig() {
  const [assetTypes, setAssetTypes] = useState<AssetTypeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<AssetTypeData | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetTypeToDelete, setAssetTypeToDelete] = useState<AssetTypeData | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  // Load asset types on component mount
  useEffect(() => {
    loadAssetTypes();
  }, []);

  const loadAssetTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAssetTypes();
      setAssetTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load asset types');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingAssetType(null);
    setDialogOpen(true);
  };

  const handleEdit = (assetType: AssetTypeData) => {
    setEditingAssetType(assetType);
    setDialogOpen(true);
  };

  const handleDelete = (assetType: AssetTypeData) => {
    setAssetTypeToDelete(assetType);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (assetTypeToDelete) {
      try {
        setSubmitting(true);
        await assetService.deleteAssetType(assetTypeToDelete.id);
        setAssetTypes(assetTypes.filter(type => type.id !== assetTypeToDelete.id));
        setDeleteDialogOpen(false);
        setAssetTypeToDelete(null);
        toast.showSuccess('Xóa loại tài sản thành công!');
      } catch (err) {
        toast.showError(err instanceof Error ? err.message : 'Failed to delete asset type');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setAssetTypeToDelete(null);
  };

  const handleAssetTypeUpdated = (updatedAssetType: AssetTypeData) => {
    setAssetTypes(assetTypes.map(type => 
      type.id === updatedAssetType.id ? updatedAssetType : type
    ));
  };

  const handleAssetTypeCreated = (newAssetType: AssetTypeData) => {
    setAssetTypes([...assetTypes, newAssetType]);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingAssetType(null);
  };

  return (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            Cấu hình loại tài sản
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
            <Button onClick={loadAssetTypes} sx={{ ml: 1 }}>Thử lại</Button>
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EmptyData
              title="Lỗi tải dữ liệu"
              description={error}
              icon="solar:danger-circle-bold"
              action={{
                text: 'Thử lại',
                onClick: loadAssetTypes,
              }}
            />
          </Box>
        ) : assetTypes.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EmptyData
              title="Không có loại tài sản nào"
              description="Chưa có dữ liệu loại tài sản nào. Hãy bắt đầu bằng cách thêm loại tài sản đầu tiên."
              icon="solar:package-broken"
              action={{
                text: 'Thêm loại tài sản',
                onClick: () => console.log('Add asset type'),
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
                    <TableCell sx={{ fontWeight: 'bold' }}>Icon</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Đơn vị</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }}>Loại</TableCell>
                    <TableCell sx={{ fontWeight: 'bold' }} align="center">
                      Thao tác
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assetTypes.map((assetType) => (
                    <TableRow key={assetType.id} hover>
                      <TableCell>{assetType.code}</TableCell>
                      <TableCell>{assetType.name}</TableCell>
                      <TableCell>
                        <Iconify icon={assetType.icon as any} width={20} />
                      </TableCell>
                      <TableCell>{assetType.unit_id}</TableCell>
                      <TableCell>{assetTypeLabels[assetType.type]}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEdit(assetType)}
                          sx={{ mr: 1 }}
                        >
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(assetType)}
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

      {/* Asset Type Dialog */}
      <AssetTypeDialog
        open={dialogOpen}
        onClose={handleClose}
        editingAssetType={editingAssetType}
        onAssetTypeUpdated={handleAssetTypeUpdated}
        onAssetTypeCreated={handleAssetTypeCreated}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Xác nhận xóa"
        content={`Bạn có chắc chắn muốn xóa loại tài sản "${assetTypeToDelete?.name}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        severity="error"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </Card>
  );
}
