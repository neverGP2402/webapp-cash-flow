import 'src/global.css';

import { useEffect } from 'react';

import Fab from '@mui/material/Fab';

import { usePathname } from 'src/routes/hooks';

import { ThemeProvider } from 'src/theme/theme-provider';

import { Iconify } from 'src/components/iconify';
import { ToastProvider } from 'src/components/toast';

// ----------------------------------------------------------------------

type AppProps = {
  children: React.ReactNode;
};

export default function App({ children }: AppProps) {
  useScrollToTop();

  const githubButton = () => (
    <Fab
      size="medium"
      aria-label="Github"
      href="#"
      sx={{
        zIndex: 9,
        right: 20,
        bottom: 20,
        width: 48,
        height: 48,
        position: 'fixed',
        bgcolor: 'blue',
      }}
    >
      <Iconify width={24} icon="socials:facebook" sx={{ '--color': 'white' }} />
    </Fab>
  );

  return (
    <ThemeProvider>
      <ToastProvider>
        {children}
        {githubButton()}
      </ToastProvider>
    </ThemeProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
