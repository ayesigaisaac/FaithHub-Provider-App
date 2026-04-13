import { useCallback, useState } from 'react';
import { useNotification } from '@/contexts/NotificationContext';

interface AsyncActionOptions {
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
  showSuccess?: boolean;
  showError?: boolean;
  delay?: number;
}

export function useAsyncAction() {
  const [isPending, setIsPending] = useState(false);
  const { showNotification, showSuccess, showError } = useNotification();

  const run = useCallback(async <T,>(action: () => Promise<T>, options: AsyncActionOptions = {}): Promise<T | null> => {
    const {
      successMessage,
      errorMessage = 'An unexpected error occurred. Please try again.',
      loadingMessage,
      showSuccess: shouldShowSuccess = true,
      showError: shouldShowError = true,
      delay = 500,
    } = options;

    setIsPending(true);
    if (loadingMessage) {
      showNotification(loadingMessage);
    }

    try {
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      const result = await action();
      if (shouldShowSuccess && successMessage) {
        showSuccess(successMessage);
      }
      return result;
    } catch (error) {
      console.error('Async action failed:', error);
      if (shouldShowError) {
        showError(errorMessage);
      }
      return null;
    } finally {
      setIsPending(false);
    }
  }, [showError, showNotification, showSuccess]);

  return { run, isPending };
}
