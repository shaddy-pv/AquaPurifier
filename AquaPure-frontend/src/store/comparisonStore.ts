import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ComparisonItem {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  features?: string[];
}

interface ComparisonStore {
  items: ComparisonItem[];
  addItem: (item: ComparisonItem) => void;
  removeItem: (id: string) => void;
  isInComparison: (id: string) => boolean;
  clearComparison: () => void;
}

export const useComparisonStore = create<ComparisonStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => {
        const items = get().items;
        if (items.length >= 3) {
          return; // Max 3 items for comparison
        }
        if (!items.find((i) => i.id === item.id)) {
          set({ items: [...items, item] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      
      isInComparison: (id) => {
        return get().items.some((item) => item.id === id);
      },
      
      clearComparison: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'aquapure-comparison',
    }
  )
);
