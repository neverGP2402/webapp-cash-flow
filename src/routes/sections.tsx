import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { RouteGuard } from 'src/components/route-guard/index';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('src/pages/dashboard'));
export const AssetsPage = lazy(() => import('src/pages/assets'));
export const AddAssetPage = lazy(() => import('src/pages/add-asset'));
export const AssetDetailPage = lazy(() => import('src/pages/asset-detail'));
export const FinancialGoalsPage = lazy(() => import('src/pages/financial-goals'));
export const TransactionHistoryPage = lazy(() => import('src/pages/transaction-history'));
export const FinancialReportsPage = lazy(() => import('src/pages/financial-reports'));
export const ProfileSettingsPage = lazy(() => import('src/pages/profile-settings'));
export const BlogPage = lazy(() => import('src/pages/blog'));
export const UserPage = lazy(() => import('src/pages/user'));
export const SettingsPage = lazy(() => import('src/pages/settings'));
export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const SignUpPage = lazy(() => import('src/pages/sign-up'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const DebtManagementPage = lazy(() => import('src/pages/debt-management'));
export const WalletManagementPage = lazy(() => import('src/pages/wallet-management'));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
  {
    element: (
      <RouteGuard requireAuth={true}>
        <DashboardLayout>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </RouteGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'assets', element: <AssetsPage /> },
      { path: 'add-asset', element: <AddAssetPage /> },
      { path: 'asset-detail', element: <AssetDetailPage /> },
      { path: 'financial-goals', element: <FinancialGoalsPage /> },
      { path: 'transaction-history', element: <TransactionHistoryPage /> },
      { path: 'financial-reports', element: <FinancialReportsPage /> },
      { path: 'profile-settings', element: <ProfileSettingsPage /> },
      { path: 'debt-management', element: <DebtManagementPage />},
      { path: 'wallet-management', element: <WalletManagementPage />},
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <RouteGuard requireAuth={false} redirectTo="/">
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      </RouteGuard>
    ),
  },
  {
    path: 'sign-up',
    element: (
      <RouteGuard requireAuth={false} redirectTo="/">
        <AuthLayout>
          <SignUpPage />
        </AuthLayout>
      </RouteGuard>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
];
