import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormHelperText from '@mui/material/FormHelperText';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';
import { useToast } from 'src/components/toast';
import { SocialLoginGroup } from 'src/components/social-login';
import { LanguageSwitcher } from 'src/components/language-switcher';
import { authService, RegisterRequest } from 'src/services/auth.service';
import { useAuthTranslation } from 'src/hooks/use-translation';

// ----------------------------------------------------------------------

export function SignUpView() {
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { signUp: t, validation: vt, success: st, error: et } = useAuthTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<RegisterRequest>({
    username: '',
    email: '',
    password: '',
    full_name: '',
    birthday: '',
    gender: 'MALE',
    address: '',
    avatar: '',
    province_id: undefined,
    ward_id: undefined,
    role_permission_id: 2, // Default role
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegisterRequest, string>>>({});

  const handleInputChange = useCallback((field: keyof RegisterRequest) => (
    event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const value = 'value' in event ? event.value : event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [formErrors]);

  const handleGenderChange = useCallback((event: SelectChangeEvent) => {
    const value = event.target.value as 'MALE' | 'FEMALE' | 'OTHER';
    setFormData(prev => ({ ...prev, gender: value }));
    
    // Clear error for this field
    if (formErrors.gender) {
      setFormErrors(prev => ({ ...prev, gender: '' }));
    }
  }, [formErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: Partial<Record<keyof RegisterRequest, string>> = {};

    // Username validation
    if (!formData.username || formData.username.length < 3) {
      errors.username = vt.usernameRequired;
    } else if (formData.username.length > 50) {
      errors.username = vt.usernameTooLong;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      errors.email = vt.emailRequired;
    } else if (!emailRegex.test(formData.email)) {
      errors.email = vt.emailInvalid;
    }

    // Password validation
    if (!formData.password) {
      errors.password = vt.passwordRequired;
    } else if (formData.password.length < 8) {
      errors.password = vt.passwordTooShort;
    } else if (formData.password.length > 255) {
      errors.password = vt.passwordTooLong;
    } else {
      const hasUpperCase = /[A-Z]/.test(formData.password);
      const hasLowerCase = /[a-z]/.test(formData.password);
      const hasDigit = /\d/.test(formData.password);
      
      if (!hasUpperCase || !hasLowerCase || !hasDigit) {
        errors.password = vt.passwordRequirements;
      }
    }

    // Birthday validation (optional but if provided, must be valid)
    if (formData.birthday) {
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
      if (!dateRegex.test(formData.birthday)) {
        errors.birthday = vt.birthdayInvalid;
      } else {
        // Additional validation for valid date
        const [day, month, year] = formData.birthday.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const isValidDate = date.getFullYear() === year && 
                          date.getMonth() === month - 1 && 
                          date.getDate() === day;
        
        if (!isValidDate) {
          errors.birthday = vt.birthdayInvalidDate;
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const handleSignUp = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      
      if (response.status === 'created') {
        showSuccess(st.registrationSuccess);
        // Redirect to sign-in page after successful registration
        setTimeout(() => {
          router.push('/sign-in');
        }, 2000);
      }
    } catch (err: any) {
      showError(err.message || et.registrationFailed);
    } finally {
      setIsLoading(false);
    }
  }, [formData, validateForm, router, showSuccess, showError]);

  const renderForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {/* Full Name */}
      <TextField
        fullWidth
        name="full_name"
        label={t.fullNameLabel}
        value={formData.full_name}
        onChange={handleInputChange('full_name')}
        sx={{ mb: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />
      {/* Username */}
      <TextField
        fullWidth
        name="username"
        label={t.usernameLabel}
        value={formData.username}
        onChange={handleInputChange('username')}
        error={!!formErrors.username}
        helperText={formErrors.username}
        sx={{ mb: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      {/* Email */}
      <TextField
        fullWidth
        name="email"
        label={t.emailLabel}
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        error={!!formErrors.email}
        helperText={formErrors.email}
        sx={{ mb: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      {/* Password */}
      <TextField
        fullWidth
        name="password"
        label={t.passwordLabel}
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleInputChange('password')}
        error={!!formErrors.password}
        helperText={formErrors.password || vt.passwordRequirements}
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
        sx={{ mb: 2 }}
      />

      {/* Birthday and Gender - Horizontal Layout */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        {/* Birthday */}
        <TextField
          fullWidth
          name="birthday"
          label={t.birthdayLabel}
          sx={{ width: '100%' }}
          type="text"
          placeholder="DD-MM-YYYY"
          value={formData.birthday}
          onChange={handleInputChange('birthday')}
          error={!!formErrors.birthday}
          helperText={formErrors.birthday}
          slotProps={{
            inputLabel: { shrink: true },
            input: {
              inputProps: {
                maxLength: 10,
              },
            },
          }}
        />

        {/* Gender */}
        <FormControl fullWidth>
          <InputLabel id="gender-label">{t.genderLabel}</InputLabel>
          <Select
            labelId="gender-label"
            name="gender"
            value={formData.gender}
            onChange={handleGenderChange}
            label={t.genderLabel}
          >
            <MenuItem value="MALE">{t.male}</MenuItem>
            <MenuItem value="FEMALE">{t.female}</MenuItem>
            <MenuItem value="OTHER">{t.other}</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Address */}
      <TextField
        fullWidth
        name="address"
        label={t.addressLabel}
        multiline
        rows={2}
        value={formData.address}
        onChange={handleInputChange('address')}
        sx={{ mb: 2 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      
      {/* Submit Button */}
      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        onClick={handleSignUp}
        disabled={isLoading}
        sx={{ mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} color="inherit" /> : t.signUpButton}
      </Button>

      <Box sx={{ alignSelf: 'center' }}>
        <Typography variant="body2" color="inherit" component="span">
          {t.alreadyHaveAccount}
        </Typography>
        <Link 
          variant="subtitle2" 
          sx={{ ml: 0.5, cursor: 'pointer' }}
          onClick={() => router.push('/sign-in')}
        >
          {t.signIn}
        </Link>
      </Box>
    </Box>
  );

  return (
    <>
      <Box
        sx={{
          gap: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 3,
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
        </Typography>
      </Box>
      {renderForm}
      <SocialLoginGroup circular={true} />
    </>
  );
}
