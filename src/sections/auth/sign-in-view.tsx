import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { SocialLoginGroup } from 'src/components/social-login';
import { LanguageSwitcher } from 'src/components/language-switcher';
import { useAuthTranslation } from 'src/hooks/use-translation';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { signIn: t } = useAuthTranslation();

  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(() => {
    router.push('/');
  }, [router]);

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        label={t.emailLabel}
        defaultValue="hello@gmail.com"
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        name="password"
        label={t.passwordLabel}
        defaultValue="@demo1234"
        type={showPassword ? 'text' : 'password'}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        sx={{ mb: 3 }}
      />
      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        {t.forgotPassword}
      </Link>

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        onClick={handleSignIn}
      >
        {t.signInButton}
      </Button>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Box sx={{ alignSelf: 'flex-end', width: '100%' }}>
          <LanguageSwitcher size="small" />
        </Box>
        <Typography variant="h5">{t.title}</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {t.subtitle}
          <Link variant="subtitle2" sx={{ ml: 0.5 }} href="/sign-up">
            {t.getStarted}
          </Link>
        </Typography>
      </Box>
      {renderForm}
      <SocialLoginGroup circular={true} />
    </>
  );
}
