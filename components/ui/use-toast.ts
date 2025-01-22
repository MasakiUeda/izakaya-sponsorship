import { useState, useEffect } from 'react'

export interface ToastProps {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

export function useToast() {
  const [toast, setToast] = useState<ToastProps | null>(null)

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [toast])

  const showToast = (props: ToastProps) => {
    setToast(props)
  }

  return { toast, showToast }
}

export const toast = (props: ToastProps) => {
  const { showToast } = useToast();
  showToast(props);
};

