import { create } from 'zustand';

type ModalType = 'task' | 'goal' | 'team' | 'none';

interface ModalState {
  activeModal: ModalType;
  modalData: any;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: 'none',
  modalData: null,
  openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: 'none', modalData: null }),
}));
