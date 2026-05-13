import { CONFIG } from 'src/config-global';

import { Container } from '@mui/material';

import { AssetDetailPage } from 'src/components/asset-detail';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Chi tiết tài sản - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Chi tiết tài sản trong hệ thống quản lý tài chính cá nhân My Cash Flow"
      />
      <meta name="keywords" content="tài sản, chi tiết, quản lý tài chính, cash flow" />

      <Container maxWidth="xl">
        <AssetDetailPage 
          assetId="gold-sjc"
          onPeriodChange={(period) => console.log('Period changed:', period)}
          onActionClick={(action) => console.log('Action clicked:', action)}
          onAddTransaction={() => console.log('Add transaction')}
        />
      </Container>
    </>
  );
}
