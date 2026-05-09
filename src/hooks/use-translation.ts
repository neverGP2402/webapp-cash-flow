import { useTranslation as useReactTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from 'src/locales/i18n.config';

// Re-export for convenience
export { SUPPORTED_LANGUAGES };
export type { SupportedLanguage };

/**
 * Custom hook for translations with type safety
 * Follows Single Responsibility Principle: Handles translation logic only
 */
export function useAppTranslation() {
  const { t, i18n } = useReactTranslation('common');

  return {
    t,
    currentLanguage: i18n.language as SupportedLanguage,
    changeLanguage: i18n.changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}

/**
 * Type-safe translation keys for the common namespace
 */
export type TranslationKey = 
  | 'auth.signIn.title'
  | 'auth.signIn.subtitle'
  | 'auth.signIn.getStarted'
  | 'auth.signIn.emailLabel'
  | 'auth.signIn.passwordLabel'
  | 'auth.signIn.forgotPassword'
  | 'auth.signIn.signInButton'
  | 'auth.signIn.socialLogin.title'
  | 'auth.signIn.socialLogin.google'
  | 'auth.signIn.socialLogin.github'
  | 'auth.signIn.socialLogin.facebook'
  | 'auth.signUp.title'
  | 'auth.signUp.subtitle'
  | 'auth.signUp.fullNameLabel'
  | 'auth.signUp.usernameLabel'
  | 'auth.signUp.emailLabel'
  | 'auth.signUp.passwordLabel'
  | 'auth.signUp.birthdayLabel'
  | 'auth.signUp.genderLabel'
  | 'auth.signUp.addressLabel'
  | 'auth.signUp.male'
  | 'auth.signUp.female'
  | 'auth.signUp.other'
  | 'auth.signUp.signUpButton'
  | 'auth.signUp.alreadyHaveAccount'
  | 'auth.signUp.signIn'
  | 'auth.signUp.socialLogin.title'
  | 'auth.signUp.socialLogin.google'
  | 'auth.signUp.socialLogin.github'
  | 'auth.signUp.socialLogin.facebook'
  | 'auth.validation.usernameRequired'
  | 'auth.validation.usernameTooLong'
  | 'auth.validation.emailRequired'
  | 'auth.validation.emailInvalid'
  | 'auth.validation.passwordRequired'
  | 'auth.validation.passwordTooShort'
  | 'auth.validation.passwordTooLong'
  | 'auth.validation.passwordRequirements'
  | 'auth.validation.birthdayInvalid'
  | 'auth.validation.birthdayInvalidDate'
  | 'auth.success.registrationSuccess'
  | 'auth.error.registrationFailed'
  | 'common.loading'
  | 'common.required'
  | 'common.optional';

/**
 * Hook specifically for authentication translations
 * Follows Single Responsibility Principle: Handles auth-specific translations only
 */
export function useAuthTranslation() {
  const { t } = useReactTranslation('common');

  return {
    // Sign In translations
    signIn: {
      title: t('auth.signIn.title'),
      subtitle: t('auth.signIn.subtitle'),
      getStarted: t('auth.signIn.getStarted'),
      emailLabel: t('auth.signIn.emailLabel'),
      passwordLabel: t('auth.signIn.passwordLabel'),
      forgotPassword: t('auth.signIn.forgotPassword'),
      signInButton: t('auth.signIn.signInButton'),
      socialLogin: {
        title: t('auth.signIn.socialLogin.title'),
        google: t('auth.signIn.socialLogin.google'),
        github: t('auth.signIn.socialLogin.github'),
        facebook: t('auth.signIn.socialLogin.facebook'),
      },
    },
    
    // Sign Up translations
    signUp: {
      title: t('auth.signUp.title'),
      subtitle: t('auth.signUp.subtitle'),
      fullNameLabel: t('auth.signUp.fullNameLabel'),
      usernameLabel: t('auth.signUp.usernameLabel'),
      emailLabel: t('auth.signUp.emailLabel'),
      passwordLabel: t('auth.signUp.passwordLabel'),
      birthdayLabel: t('auth.signUp.birthdayLabel'),
      genderLabel: t('auth.signUp.genderLabel'),
      addressLabel: t('auth.signUp.addressLabel'),
      male: t('auth.signUp.male'),
      female: t('auth.signUp.female'),
      other: t('auth.signUp.other'),
      signUpButton: t('auth.signUp.signUpButton'),
      alreadyHaveAccount: t('auth.signUp.alreadyHaveAccount'),
      signIn: t('auth.signUp.signIn'),
      socialLogin: {
        title: t('auth.signUp.socialLogin.title'),
        google: t('auth.signUp.socialLogin.google'),
        github: t('auth.signUp.socialLogin.github'),
        facebook: t('auth.signUp.socialLogin.facebook'),
      },
    },
    
    // Validation translations
    validation: {
      usernameRequired: t('auth.validation.usernameRequired'),
      usernameTooLong: t('auth.validation.usernameTooLong'),
      emailRequired: t('auth.validation.emailRequired'),
      emailInvalid: t('auth.validation.emailInvalid'),
      passwordRequired: t('auth.validation.passwordRequired'),
      passwordTooShort: t('auth.validation.passwordTooShort'),
      passwordTooLong: t('auth.validation.passwordTooLong'),
      passwordRequirements: t('auth.validation.passwordRequirements'),
      birthdayInvalid: t('auth.validation.birthdayInvalid'),
      birthdayInvalidDate: t('auth.validation.birthdayInvalidDate'),
    },
    
    // Success and error messages
    success: {
      registrationSuccess: t('auth.success.registrationSuccess'),
    },
    error: {
      registrationFailed: t('auth.error.registrationFailed'),
    },
  };
}
