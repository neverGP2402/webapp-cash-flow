import { CONFIG } from 'src/config-global';

import { Container } from '@mui/material';

import { ProfileSettingsPage } from 'src/components/profile-settings';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Hồ sơ & Cài đặt - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Quản lý hồ sơ và cài đặt cá nhân trong hệ thống quản lý tài chính My Cash Flow"
      />
      <meta name="keywords" content="hồ sơ, cài đặt, tài khoản, bảo mật, quản lý tài chính" />

      <Container maxWidth="xl">
        <ProfileSettingsPage />
      </Container>
    </>
  );
}
