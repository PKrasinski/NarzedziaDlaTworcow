import { toast } from "sonner";

export const useCustomToast = () => {
  const showDevelopmentToast = () => {
    toast.info("Ta funkcja jest w trakcie rozwoju. Spróbuj ponownie później.", {
      description: "Pracujemy nad udostępnieniem tej funkcjonalności",
      duration: 4000,
    });
  };

  const showSuccessToast = (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 3000,
    });
  };

  const showErrorToast = (message: string, description?: string) => {
    toast.error(message, {
      description,
      duration: 4000,
    });
  };

  const showInfoToast = (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  };

  return {
    showDevelopmentToast,
    showSuccessToast,
    showErrorToast,
    showInfoToast,
  };
};
