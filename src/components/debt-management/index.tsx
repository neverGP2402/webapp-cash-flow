import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';

import {
  Box,
  Typography,
  Container,
  useTheme,
  alpha,
  Button,
  Tab,
  Tabs,
  Skeleton,
} from '@mui/material';

import { Iconify } from 'src/components/iconify';

import { OverviewCards } from './overview-cards';
import { DebtCard } from './debt-card';
import { PaymentTimeline } from './payment-timeline';
import { DebtCharts } from './debt-charts';
import { CounterpartyAnalytics } from './counterparty-analytics';
import { DebtWarnings } from './debt-warnings';
import { DebtFilters } from './debt-filters';
import { EmptyState } from './empty-state';
import { DebtDetailDrawer } from './debt-detail-drawer';
import { AddDebtDrawer } from './add-debt-drawer';

import type { Debt, DebtFilterOptions, DebtManagementData } from 'src/types/debt-management';

// ----------------------------------------------------------------------

export default function DebtManagementPage() {
  const { t } = useTranslation('debtManagement');
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedDebt, setSelectedDebt] = useState<Debt | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [addDrawerMode, setAddDrawerMode] = useState<'create' | 'edit'>('create');
  const [filters, setFilters] = useState<DebtFilterOptions>({
    search: '',
    type: 'all',
    status: 'all',
    paymentType: 'all',
    dateRange: 'all',
  });

  // Mock data - In production, this would come from API
  const mockData: DebtManagementData = {
    overview: {
      totalOwed: 150000000,
      totalOwedToMe: 80000000,
      totalPaid: 45000000,
      totalRemaining: 185000000,
      upcomingDue: 25000000,
      overdue: 15000000,
    },
    debts: [
      {
        id: '1',
        counterparty: {
          id: 'cp1',
          name: 'Nguyễn Văn A',
          avatar: '',
          phone: '0901234567',
          email: 'nguyenvana@example.com',
          type: 'individual',
        },
        type: 'borrowing',
        paymentType: 'installment',
        contractNumber: 'HD-2024-001',
        principal: 150000000,
        paidAmount: 50000000,
        remainingAmount: 100000000,
        interestRate: 12,
        startDate: '2024-01-01',
        dueDate: '2024-12-31',
        status: 'active',
        description: 'Vay mua nhà',
        createdAt: '2024-01-01',
        updatedAt: '2024-05-01',
      },
      {
        id: '2',
        counterparty: {
          id: 'cp2',
          name: 'Trần Thị B',
          avatar: '',
          phone: '0912345678',
          email: 'tranthib@example.com',
          type: 'individual',
        },
        type: 'lending',
        paymentType: 'oneTime',
        contractNumber: 'HD-2024-002',
        principal: 50000000,
        paidAmount: 0,
        remainingAmount: 50000000,
        interestRate: 10,
        startDate: '2024-02-01',
        dueDate: '2024-08-01',
        status: 'active',
        description: 'Cho vay kinh doanh',
        createdAt: '2024-02-01',
        updatedAt: '2024-05-01',
      },
    ],
    timeline: [],
    charts: [],
    counterpartyAnalytics: [],
    warnings: [],
  };

  const filteredDebts = useMemo(() => {
    return mockData.debts.filter((debt) => {
      if (filters.search && !debt.counterparty.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.type !== 'all' && debt.type !== filters.type) {
        return false;
      }
      if (filters.status !== 'all' && debt.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [mockData.debts, filters]);

  const handleFilterChange = (newFilters: Partial<DebtFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleDebtClick = (debt: Debt) => {
    setSelectedDebt(debt);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedDebt(null);
  };

  const handlePayNow = (debtId: string) => {
    console.log('Pay now for debt:', debtId);
    // Implement payment logic
  };

  const handleUpdateDebt = (debtId: string) => {
    console.log('Update debt:', debtId);
    // Implement update logic
  };

  const handleAddPayment = (debtId: string) => {
    console.log('Add payment for debt:', debtId);
    // Implement add payment logic
  };

  const handleMarkComplete = (debtId: string) => {
    console.log('Mark debt as complete:', debtId);
    // Implement mark complete logic
  };

  const handleAddDebt = () => {
    setAddDrawerMode('create');
    setSelectedDebt(null);
    setIsAddDrawerOpen(true);
  };

  const handleEditDebt = (debt: Debt) => {
    setAddDrawerMode('edit');
    setSelectedDebt(debt);
    setIsAddDrawerOpen(true);
  };

  const handleAddDrawerClose = () => {
    setIsAddDrawerOpen(false);
    setSelectedDebt(null);
  };

  const handleSaveDebt = async (data: any) => {
    console.log('Save debt:', data);
    // Implement save logic
    setIsAddDrawerOpen(false);
  };

  const handleSaveDraft = async (data: any) => {
    console.log('Save draft:', data);
    // Implement save draft logic
    setIsAddDrawerOpen(false);
  };

  const tabs = [
    { label: t('filters.all'), value: 0 },
    { label: t('filters.iOwe'), value: 1 },
    { label: t('filters.owedToMe'), value: 2 },
    { label: t('filters.overdue'), value: 3 },
  ];

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 28 }}>💳</Typography>
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={700} sx={{ mb: 0.5 }}>
                {t('pageTitle')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('subtitle')}
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<Iconify icon="solar:check-circle-bold" width={20} />}
            onClick={handleAddDebt}
            sx={{
              borderRadius: 2,
              px: 3,
              py: 1.5,
              fontWeight: 600,
            }}
          >
            {t('actions.addDebt')}
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <OverviewCards overview={mockData.overview} />

      {/* Warnings */}
      {mockData.warnings.length > 0 && <DebtWarnings warnings={mockData.warnings} />}

      {/* Filters */}
      <DebtFilters filters={filters} onFilterChange={handleFilterChange} />

      {/* Tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiTabs-indicator': {
              height: 3,
              borderRadius: 3,
            },
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.value}
              label={tab.label}
              sx={{
                fontWeight: 600,
                fontSize: 14,
                textTransform: 'none',
                minHeight: 48,
              }}
            />
          ))}
        </Tabs>
      </Box>

      {/* Debt List */}
      {filteredDebts.length === 0 ? (
        <EmptyState />
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            gap: 3,
            mb: 4,
          }}
        >
          {filteredDebts.map((debt) => (
            <DebtCard key={debt.id} debt={debt} onClick={() => handleDebtClick(debt)} />
          ))}
        </Box>
      )}

      {/* Charts */}
      {mockData.charts.length > 0 && <DebtCharts charts={mockData.charts} />}

      {/* Timeline */}
      {mockData.timeline.length > 0 && <PaymentTimeline timeline={mockData.timeline} />}

      {/* Counterparty Analytics */}
      {mockData.counterpartyAnalytics.length > 0 && <CounterpartyAnalytics analytics={mockData.counterpartyAnalytics} />}

      {/* Debt Detail Drawer */}
      <DebtDetailDrawer
        open={isDrawerOpen}
        debt={selectedDebt}
        onClose={handleDrawerClose}
        onPayNow={handlePayNow}
        onUpdate={handleUpdateDebt}
        onAddPayment={handleAddPayment}
        onMarkComplete={handleMarkComplete}
      />

      {/* Add Debt Drawer */}
      <AddDebtDrawer
        open={isAddDrawerOpen}
        mode={addDrawerMode}
        debt={selectedDebt || undefined}
        onClose={handleAddDrawerClose}
        onSave={handleSaveDebt}
        onSaveDraft={handleSaveDraft}
      />
    </Container>
  );
}
