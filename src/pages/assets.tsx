import { CONFIG } from 'src/config-global';

import { AssetsView } from 'src/sections/assets/view/assets-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Tài sản của tôi - ${CONFIG.appName}`}</title>
      <meta
        name="description"
        content="Quản lý và theo dõi tài sản cá nhân của bạn với Cash Flow"
      />
      <meta name="keywords" content="tài sản, quản lý tài chính, đầu tư, tiền mặt, ngân hàng" />

      <AssetsView />
    </>
  );
}
