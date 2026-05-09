import { useState } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

interface AssetTypeConfigData {
  id: string;
  code: string;
  name: string;
  icon: string;
  unit: string;
  type: 'PHYSICAL' | 'DIGITAL' | 'CASH';
  createdAt: string;
  createdBy: string;
}

const mockAssetTypes: AssetTypeConfigData[] = [
  {
    id: '1',
    code: 'MONEY',
    name: 'Tiền mặt',
    icon: 'mdi:cash',
    unit: 'VND',
    type: 'CASH',
    createdAt: '01/01/2024',
    createdBy: 'Admin',
  },
  {
    id: '2',
    code: 'BANK',
    name: 'Ngân hàng',
    icon: 'mdi:bank',
    unit: 'VND',
    type: 'DIGITAL',
    createdAt: '01/01/2024',
    createdBy: 'Admin',
  },
  {
    id: '3',
    code: 'GOLD',
    name: 'Vàng',
    icon: 'mdi:gold',
    unit: 'CHI',
    type: 'PHYSICAL',
    createdAt: '02/01/2024',
    createdBy: 'Admin',
  },
  {
    id: '4',
    code: 'CRYPTO',
    name: 'Tiền điện tử',
    icon: 'mdi:bitcoin',
    unit: 'BTC',
    type: 'DIGITAL',
    createdAt: '02/01/2024',
    createdBy: 'Admin',
  },
];

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

const mockUnits = [
  { code: 'VND', name: 'Việt Nam Đồng' },
  { code: 'USD', name: 'Đô la Mỹ' },
  { code: 'CHI', name: 'Chỉ vàng' },
  { code: 'BTC', name: 'Bitcoin' },
  { code: 'CAI', name: 'Cái' },
];

export function AssetTypeConfig() {
  const [assetTypes, setAssetTypes] = useState<AssetTypeConfigData[]>(mockAssetTypes);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<AssetTypeConfigData | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    icon: '',
    unit: '',
    type: 'PHYSICAL' as AssetTypeConfigData['type'],
  });

  const handleAdd = () => {
    setEditingAssetType(null);
    setFormData({ code: '', name: '', icon: '', unit: '', type: 'PHYSICAL' });
    setDialogOpen(true);
  };

  const handleEdit = (assetType: AssetTypeConfigData) => {
    setEditingAssetType(assetType);
    setFormData({
      code: assetType.code,
      name: assetType.name,
      icon: assetType.icon,
      unit: assetType.unit,
      type: assetType.type,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setAssetTypes(assetTypes.filter(type => type.id !== id));
  };

  const handleSubmit = () => {
    if (editingAssetType) {
      // Update existing asset type
      setAssetTypes(assetTypes.map(type => 
        type.id === editingAssetType.id 
          ? { ...type, ...formData }
          : type
      ));
    } else {
      // Add new asset type
      const newAssetType: AssetTypeConfigData = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        createdBy: 'Admin',
      };
      setAssetTypes([...assetTypes, newAssetType]);
    }
    setDialogOpen(false);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingAssetType(null);
    setFormData({ code: '', name: '', icon: '', unit: '', type: 'PHYSICAL' });
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
          >
            Thêm mới
          </Button>
        </Box>

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
                  <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Người tạo</TableCell>
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
                    <TableCell>{assetType.unit}</TableCell>
                    <TableCell>{assetTypeLabels[assetType.type]}</TableCell>
                    <TableCell>{assetType.createdAt}</TableCell>
                    <TableCell>{assetType.createdBy}</TableCell>
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
                        onClick={() => handleDelete(assetType.id)}
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
      </CardContent>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
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
              <FormControl fullWidth>
                <InputLabel>Đơn vị tính</InputLabel>
                <Select
                  value={formData.unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  label="Đơn vị tính"
                >
                  {mockUnits.map((unit) => (
                    <MenuItem key={unit.code} value={unit.code}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel>Loại tài sản</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as AssetTypeConfigData['type'] }))}
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
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingAssetType ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
