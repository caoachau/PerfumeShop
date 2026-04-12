import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export interface CartItem {
  variantId: string;
  productId: string;
  productName: string;
  productImage: string;
  size: string;
  price: number;
  qty: number;
  stock: number;
  engravingText?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

interface CartActions {
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQty: (variantId: string, qty: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  setItems: (items: CartItem[]) => void;
}

type CartStore = CartState & CartActions;

function persistCart(items: CartItem[]) {
  try {
    localStorage.setItem('parfum_cart', JSON.stringify(items));
  } catch {
    // storage full or unavailable
  }
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('parfum_cart');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useCartStore = create<CartStore>()(
  subscribeWithSelector((set, get) => ({
    items: loadCart(),
    isOpen: false,

    addItem: (item) => {
      const { items } = get();
      const existing = items.find((i) => i.variantId === item.variantId);

      let next: CartItem[];
      if (existing) {
        const newQty = Math.min(existing.qty + item.qty, item.stock);
        next = items.map((i) => (i.variantId === item.variantId ? { ...i, qty: newQty } : i));
      } else {
        next = [...items, item];
      }

      persistCart(next);
      set({ items: next });
    },

    removeItem: (variantId) => {
      const next = get().items.filter((i) => i.variantId !== variantId);
      persistCart(next);
      set({ items: next });
    },

    updateQty: (variantId, qty) => {
      if (qty < 1) return;
      const next = get().items.map((i) =>
        i.variantId === variantId ? { ...i, qty: Math.min(qty, i.stock) } : i,
      );
      persistCart(next);
      set({ items: next });
    },

    clearCart: () => {
      persistCart([]);
      set({ items: [] });
    },

    toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

    setItems: (items) => {
      persistCart(items);
      set({ items });
    },
  })),
);

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0);
}
