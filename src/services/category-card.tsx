import { Card, Box, Typography, IconButton, Stack, alpha } from '@mui/material';
import { Iconify } from 'src/components/iconify';
import { Label } from 'src/components/label';
import { Category } from 'src/types/config-transaction';

interface Props {
  category: Category;
  onEdit: (cat: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: Props) {
  const isIncome = category.type === 'INCOME';

  return (
    <Card sx={{ 
      p: 2.5, 
      borderRadius: 2, 
      border: (theme) => `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      boxShadow: (theme) => `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: (theme) => theme.customShadows.z16 }
    }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box sx={{ 
          p: 1.5, borderRadius: 1.5, 
          bgcolor: (theme) => alpha(isIncome ? theme.palette.success.main : theme.palette.error.main, 0.1),
          color: isIncome ? 'success.main' : 'error.main'
        }}>
          <Iconify icon={(isIncome ? 'solar:alt-arrow-down-bold' : 'solar:alt-arrow-up-bold') as any} width={24} />
        </Box>

        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{category.name}</Typography>
          <Typography variant="caption" color="text.secondary">CODE: {category.code}</Typography>
        </Box>

        <Stack direction="row">
          <IconButton onClick={() => onEdit(category)} size="small" color="primary">
            <Iconify icon="solar:pen-bold" />
          </IconButton>
          <IconButton onClick={() => onDelete(category.id)} size="small" color="error">
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
        <Label color={isIncome ? 'success' : 'error'} variant="soft">
          {isIncome ? 'Thu nhập' : 'Chi tiêu'}
        </Label>
        {category.description && (
           <Typography variant="caption" color="text.disabled" noWrap sx={{ maxWidth: 150 }}>
             {category.description}
           </Typography>
        )}
      </Stack>
    </Card>
  );
}