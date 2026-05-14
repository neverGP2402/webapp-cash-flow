import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Tài sản của tôi',
    path: '/assets',
    icon: icon('wallet-money'),
  },
  {
    title: 'Thêm tài sản',
    path: '/add-asset',
    icon: icon('ic-cart'),
  },
  {
    title: 'Chi tiết tài sản',
    path: '/asset-detail',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Công nợ',
    path: '/debt-management',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Ví của tôi',
    path: '/wallet-management',
    icon: icon('ic-my-wallet'),
  },
  {
    title: 'Mục tiêu tài chính',
    path: '/financial-goals',
    icon: icon('ticker-star'),
  },
  {
    title: 'Lịch sử giao dịch',
    path: '/transaction-history',
    icon: icon('ic-finance'),
  },
  {
    title: 'Báo cáo & Thống kê',
    path: '/financial-reports',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Hồ sơ & Cài đặt',
    path: '/profile-settings',
    icon: icon('ic-user'),
  },
  {
    title: 'Danh sách người dùng',
    path: '/user',
    icon: icon('ic-user'),
  },
  // {
  //   title: 'Product',
  //   path: '/products',
  //   icon: icon('ic-cart'),
  //   info: (
  //     <Label color="error" variant="inverted">
  //       +3
  //     </Label>
  //   ),
  // },
  // {
  //   title: 'Blog',
  //   path: '/blog',
  //   icon: icon('ic-blog'),
  // },
  // {
  //   title: 'Sign in',
  //   path: '/sign-in',
  //   icon: icon('ic-lock'),
  // },
  {
    title: 'Cấu hình chung',
    path: '/settings',
    icon: icon('setting'),
  },
  // {
  //   title: 'Not found',
  //   path: '/404',
  //   icon: icon('ic-disabled'),
  // },
];
