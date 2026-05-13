// ----------------------------------------------------------------------

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  avatar: string | null;
  joinDate: string;
  accountStatus: 'active' | 'suspended' | 'inactive';
  securityLevel: 'low' | 'medium' | 'high';
  isOnline: boolean;
  language?: string;
  currency?: string;
  timezone?: string;
  numberFormat?: string;
  dateFormat?: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  pinEnabled: boolean;
  biometricEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  lastPasswordChange: string;
  securityScore: number;
}

export interface ActiveSession {
  id: string;
  device: string;
  platform: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface NotificationSettings {
  transactionAlerts: boolean;
  spendingWarnings: boolean;
  goalReminders: boolean;
  debtReminders: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface ApplicationSettings {
  language: string;
  currency: string;
  timezone: string;
  numberFormat: string;
  dateFormat: string;
}

export interface PrivacySettings {
  hideBalance: boolean;
  quickLock: boolean;
  requireAuthToViewAssets: boolean;
  limitSensitiveData: boolean;
}
