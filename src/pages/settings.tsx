import { CONFIG } from 'src/config-global';
import { SettingsView } from 'src/sections/settings/view/settings-view';

export default function Page() {
  return (
    <>
      <title>{`Cấu hình chung - ${CONFIG.appName}`}</title>
      <meta name="description" content="Cấu hình hệ thống quản lý tài chính" />
      <SettingsView />
    </>
  );
}
