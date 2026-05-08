import { create } from 'zustand';

type ModalType = 'task' | 'goal' | 'team' | 'none';

interface ModalState {
  activeModal: ModalType;
  modalData: any;
  isMobileSidebarOpen: boolean;
  openModal: (type: ModalType, data?: any) => void;
  closeModal: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
}

export const useModalStore = create<ModalState>((set) => ({
  activeModal: 'none',
  modalData: null,
  isMobileSidebarOpen: false,
  openModal: (type, data = null) => set({ activeModal: type, modalData: data }),
  closeModal: () => set({ activeModal: 'none', modalData: null }),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
}));
