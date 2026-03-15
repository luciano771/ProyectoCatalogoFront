import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode
} from 'react';
import * as cartApi from '../api/cart-api';

export interface CartItem {
  productId: string;
  name: string;
  price: string;
  imageCoverUrl: string | null;
  quantity: number;
}

interface CartContextValue {
  storeSlug: string | null;
  setStoreSlug: (slug: string | null) => void;
  items: CartItem[];
  loading: boolean;
  addItem: (slug: string, productId: string, quantity?: number) => Promise<void>;
  removeItem: (slug: string, productId: string) => Promise<void>;
  setQuantity: (slug: string, productId: string, quantity: number) => Promise<void>;
  clear: (slug: string) => Promise<void>;
  totalItems: number;
  refreshCart: (slug: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [storeSlug, setStoreSlugState] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const res = await cartApi.getCart(slug);
      setItems(res.items);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const setStoreSlug = useCallback(
    (slug: string | null) => {
      setStoreSlugState(slug);
      if (slug) {
        refreshCart(slug);
      } else {
        setItems([]);
      }
    },
    [refreshCart]
  );

  const addItem = useCallback(
    async (slug: string, productId: string, quantity = 1) => {
      setLoading(true);
      try {
        const res = await cartApi.addCartItem(slug, productId, quantity);
        setItems(res.items);
        if (!storeSlug || storeSlug === slug) {
          setStoreSlugState(slug);
        }
      } finally {
        setLoading(false);
      }
    },
    [storeSlug]
  );

  const removeItem = useCallback(async (slug: string, productId: string) => {
    setLoading(true);
    try {
      const res = await cartApi.removeCartItem(slug, productId);
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }, []);

  const setQuantity = useCallback(
    async (slug: string, productId: string, quantity: number) => {
      if (quantity <= 0) {
        await removeItem(slug, productId);
        return;
      }
      setLoading(true);
      try {
        const res = await cartApi.updateCartItem(slug, productId, quantity);
        setItems(res.items);
      } finally {
        setLoading(false);
      }
    },
    [removeItem]
  );

  const clear = useCallback(async (slug: string) => {
    setLoading(true);
    try {
      const res = await cartApi.clearCartApi(slug);
      setItems(res.items);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      storeSlug,
      setStoreSlug,
      items,
      loading,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalItems,
      refreshCart
    }),
    [
      storeSlug,
      setStoreSlug,
      items,
      loading,
      addItem,
      removeItem,
      setQuantity,
      clear,
      totalItems,
      refreshCart
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
};
