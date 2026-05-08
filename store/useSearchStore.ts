import { create } from 'zustand';

interface SearchState {
  query: string;
  setQuery: (query: string) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  setQuery: (query) => set({ query }),
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
