import { Box, Container } from '@mui/material';
import { AssetAllocation } from '../components/asset-allocation';
import { AssetCategories } from '../components/asset-categories';
import { AssetInsights } from '../components/asset-insights';
import { AssetsGrowthChart } from '../components/assets-growth-chart';
import { FinancialGoals } from '../components/financial-goals';
import { RecentTransactions } from '../components/recent-transactions';
import { AssetsOverview } from '../components/assets-overview';
// ----------------------------------------------------------------------

export function AssetsView() {
  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 3 }} mt={2}>
        {/* Tổng quan tài sản */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <AssetsOverview />
        </Box>
      
        {/* Biểu đồ tăng trưởng */}
        <Box sx={{ 
          gridColumn: { xs: 'span 12', md: 'span 6' }
        }}>
          <AssetsGrowthChart />
        </Box>

        {/* Phân bổ tài sản */}
        <Box sx={{ 
          gridColumn: { xs: 'span 12', md: 'span 6' }
        }}>
          <AssetAllocation />
        </Box>

        {/* Danh mục tài sản */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <AssetCategories />
        </Box>

        {/* Mục tiêu tài chính */}
        <Box sx={{ 
          gridColumn: { xs: 'span 12', md: 'span 6' }
        }}>
          <FinancialGoals />
        </Box>

        {/* Timeline hoạt động */}
        <Box sx={{ 
          gridColumn: { xs: 'span 12', md: 'span 6' }
        }}>
          <RecentTransactions />
        </Box>

        {/* Insights */}
        <Box sx={{ gridColumn: 'span 12' }}>
          <AssetInsights />
        </Box>
      </Box>
    </Container>
  );
}
