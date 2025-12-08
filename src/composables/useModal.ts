import { ref } from 'vue'

interface ModalState {
  show: boolean
  title: string
  message: string
}

const modalState = ref<ModalState>({
  show: false,
  title: '提示',
  message: ''
})

export function useModal() {
  const showModal = (message: string, title: string = '提示') => {
    modalState.value = {
      show: true,
      title,
      message
    }
  }

  const hideModal = () => {
    modalState.value.show = false
  }

  return {
    modalState,
    showModal,
    hideModal
  }
}
