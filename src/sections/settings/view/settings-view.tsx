import { Container, Box } from '@mui/material';
import { UnitConfig } from '../components/unit-config';
import { AssetTypeConfig } from '../components/asset-type-config';

export function SettingsView() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }}>
        {/* Cấu hình đơn vị tính */}
        <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 6' } }}>
          <UnitConfig />
        </Box>

        {/* Cấu hình loại tài sản */}
        <Box sx={{ gridColumn: { xs: 'span 12', lg: 'span 6' } }}>
          <AssetTypeConfig />
        </Box>
      </Box>
    </Container>
  );
}
