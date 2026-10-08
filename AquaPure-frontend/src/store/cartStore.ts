import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { usePromotionStore } from './promotionStore';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  appliedCoupon: string | null;
  couponDiscountValue: number;
  couponDiscountType: 'percentage' | 'fixed' | null;
  couponDescription: string;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string; discountText?: string };
  removeCoupon: () => void;
  getDiscountAmount: () => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      appliedCoupon: null,
      couponDiscountValue: 0,
      couponDiscountType: null,
      couponDescription: '',
      
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        });
      },
      
      applyCoupon: (code: string) => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) {
          return { success: false, message: 'Please enter a coupon code' };
        }

        // 1. Check promotion store (admin configured)
        const liveCoupons = usePromotionStore.getState().coupons || [];
        const found = liveCoupons.find((c) => c.code.toUpperCase() === normalized && c.active);
        if (found) {
          set({
            appliedCoupon: found.code,
            couponDiscountValue: found.discountValue,
            couponDiscountType: found.discountType,
            couponDescription: found.description || found.discountText,
          });
          return {
            success: true,
            message: `Coupon ${found.code} applied!`,
            discountText: found.discountText,
          };
        }

        // 2. Fallbacks
        const FALLBACK_MAP: Record<string, { value: number; type: 'percentage' | 'fixed'; desc: string }> = {
          PRAYAG1000: { value: 1000, type: 'fixed', desc: '₹1,000 OFF' },
          FESTIVE40: { value: 40, type: 'percentage', desc: '40% OFF' },
          FREESHIP: { value: 0, type: 'fixed', desc: 'Free Express Delivery' },
          AQUA10: { value: 10, type: 'percentage', desc: '10% OFF' },
          SAVE500: { value: 500, type: 'fixed', desc: '₹500 OFF' },
        };

        const fallback = FALLBACK_MAP[normalized];
        if (fallback) {
          set({
            appliedCoupon: normalized,
            couponDiscountValue: fallback.value,
            couponDiscountType: fallback.type,
            couponDescription: fallback.desc,
          });
          return {
            success: true,
            message: `Coupon ${normalized} applied!`,
            discountText: fallback.desc,
          };
        }

        return { success: false, message: `Coupon "${normalized}" is invalid or expired` };
      },

      removeCoupon: () => {
        set({
          appliedCoupon: null,
          couponDiscountValue: 0,
          couponDiscountType: null,
          couponDescription: '',
        });
      },

      getDiscountAmount: () => {
        const { appliedCoupon, couponDiscountValue, couponDiscountType } = get();
        if (!appliedCoupon) return 0;
        const subtotal = get().getTotalPrice();
        if (couponDiscountType === 'percentage') {
          return Math.round((subtotal * couponDiscountValue) / 100);
        }
        return Math.min(couponDiscountValue, subtotal);
      },

      clearCart: () => {
        set({
          items: [],
          appliedCoupon: null,
          couponDiscountValue: 0,
          couponDiscountType: null,
          couponDescription: '',
        });
      },
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: 'aquapure-cart',
    }
  )
);
