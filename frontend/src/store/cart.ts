'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string | null;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  /** False until localStorage has been read, so the server and first client render match. */
  hydrated: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  setHydrated: () => void;
};

const ceilingFor = (stock: number) => (stock > 0 ? stock : 99);

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      hydrated: false,

      addItem: (item, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: Math.min(i.quantity + quantity, ceilingFor(item.stock)) }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, ceilingFor(item.stock)) }],
          };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productId === productId
                ? { ...i, quantity: Math.min(Math.max(quantity, 0), ceilingFor(i.stock)) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),

      clear: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'aurelia-cart',
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => state?.setHydrated(),
    },
  ),
);

export const selectCount = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectSubtotal = (state: CartState) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
