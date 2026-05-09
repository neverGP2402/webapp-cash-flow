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
} from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

interface UnitConfigData {
  id: string;
  code: string;
  name: string;
  createdAt: string;
  createdBy: string;
}

const mockUnits: UnitConfigData[] = [
  {
    id: '1',
    code: 'VND',
    name: 'Việt Nam Đồng',
    createdAt: '01/01/2024',
    createdBy: 'Admin',
  },
  {
    id: '2',
    code: 'USD',
    name: 'Đô la Mỹ',
    createdAt: '01/01/2024',
    createdBy: 'Admin',
  },
  {
    id: '3',
    code: 'CHI',
    name: 'Chỉ vàng',
    createdAt: '02/01/2024',
    createdBy: 'Admin',
  },
  {
    id: '4',
    code: 'CAI',
    name: 'Cái',
    createdAt: '02/01/2024',
    createdBy: 'Admin',
  },
];

export function UnitConfig() {
  const [units, setUnits] = useState<UnitConfigData[]>(mockUnits);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitConfigData | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
  });

  const handleAdd = () => {
    setEditingUnit(null);
    setFormData({ code: '', name: '' });
    setDialogOpen(true);
  };

  const handleEdit = (unit: UnitConfigData) => {
    setEditingUnit(unit);
    setFormData({ code: unit.code, name: unit.name });
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setUnits(units.filter(unit => unit.id !== id));
  };

  const handleSubmit = () => {
    if (editingUnit) {
      // Update existing unit
      setUnits(units.map(unit => 
        unit.id === editingUnit.id 
          ? { ...unit, code: formData.code, name: formData.name }
          : unit
      ));
    } else {
      // Add new unit
      const newUnit: UnitConfigData = {
        id: Date.now().toString(),
        code: formData.code,
        name: formData.name,
        createdAt: new Date().toLocaleDateString('vi-VN'),
        createdBy: 'Admin',
      };
      setUnits([...units, newUnit]);
    }
    setDialogOpen(false);
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
                  <TableCell sx={{ fontWeight: 'bold' }}>Ngày tạo</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Người tạo</TableCell>
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
                    <TableCell>{unit.createdAt}</TableCell>
                    <TableCell>{unit.createdBy}</TableCell>
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
                        onClick={() => handleDelete(unit.id)}
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
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingUnit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
