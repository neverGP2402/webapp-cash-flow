import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { SocialLoginGroup } from 'src/components/social-login';
import { LanguageSwitcher } from 'src/components/language-switcher';
import { useAuthTranslation } from 'src/hooks/use-translation';
import { useAuth } from 'src/contexts/auth-context';
import { useToast } from 'src/components/toast';

// ----------------------------------------------------------------------

export function SignInView() {
  const router = useRouter();
  const { signIn: t, validation: vt, error: et } = useAuthTranslation();
  const { login, isLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({
    username: '',
    password: ''
  });

  const handleInputChange = useCallback((field: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    setFormErrors(prev => {
      if (prev[field as keyof typeof prev]) {
        return { ...prev, [field]: '' };
      }
      return prev;
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const errors = {
      username: '',
      password: ''
    };

    // Username/Email validation
    if (!formData.username || formData.username.length < 3) {
      errors.username = vt.usernameRequired;
    }

    // Password validation
    if (!formData.password) {
      errors.password = vt.passwordRequired;
    } else if (formData.password.length < 8) {
      errors.password = vt.passwordTooShort;
    }

    setFormErrors(errors);
    return !errors.username && !errors.password;
  }, [formData, vt]);

  const handleSignIn = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        showSuccess('Login successful!');
        router.push('/');
      } else {
        showError(result.error || et.registrationFailed);
      }
    } catch (error: any) {
      showError(error?.message || et.registrationFailed);
    }
  }, [formData, validateForm, login, router, showSuccess, showError, et]);

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
        name="username"
        label={t.emailLabel}
        value={formData.username}
        onChange={handleInputChange('username')}
        error={!!formErrors.username}
        helperText={formErrors.username}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <TextField
        fullWidth
        name="password"
        label={t.passwordLabel}
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange('password')}
        error={!!formErrors.password}
        helperText={formErrors.password}
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
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : t.signInButton}
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
