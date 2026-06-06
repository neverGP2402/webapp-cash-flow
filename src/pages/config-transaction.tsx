import { CONFIG } from 'src/config-global';

import ConfigTransactionView from 'src/services/config-transaction-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Cấu hình giao dịch - ${CONFIG.appName}`}</title>
      <meta name="description" content="Quản lý danh mục và ví giao dịch" />

      <ConfigTransactionView />
    </>
  );
}