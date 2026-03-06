export type ToastType = 'error' | 'success' | 'loading'

interface ToastState {
  visible: boolean
  message: string
  type: ToastType
}

export const useToast = () => {
  const toast = useState<ToastState>('toast', () => ({
    visible: false,
    message: '',
    type: 'error',
  }))

  let timer: ReturnType<typeof setTimeout> | null = null

  const show = (message: string, type: ToastType, duration = 3500) => {
    if (timer) clearTimeout(timer)
    toast.value = { visible: true, message, type }
    if (duration > 0) {
      timer = setTimeout(() => { toast.value.visible = false }, duration)
    }
  }

  return {
    toast: readonly(toast),
    error:   (message: string) => show(message, 'error'),
    success: (message: string) => show(message, 'success'),
    loading: (message: string) => show(message, 'loading', 0), // no auto-dismiss
    dismiss: () => {
      if (timer) clearTimeout(timer)
      toast.value.visible = false
    },
  }
}
