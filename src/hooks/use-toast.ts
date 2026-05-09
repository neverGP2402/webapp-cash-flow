import { useToast } from 'src/components/toast';

// Custom hook for easier toast usage
export function useAppToast() {
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToast();

  return {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
