import { create } from 'zustand';

const useStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  toastMsg: '',
  toastVisible: false,
  modal: { open: false, content: null },

  addToCart: (product) => {
    const cart = get().cart;
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      set({ cart: cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) });
    } else {
      set({ cart: [...cart, { ...product, qty: 1, days: 1 }] });
    }
    get().showToast(`${product.name} ditambahkan ke keranjang`, '🛒');
  },

  removeFromCart: (id) => set({ cart: get().cart.filter(i => i.id !== id) }),

  updateQty: (id, delta) => set({
    cart: get().cart.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i),
  }),

  clearCart: () => set({ cart: [] }),

  toggleWishlist: (id) => {
    const wl = get().wishlist;
    if (wl.includes(id)) {
      set({ wishlist: wl.filter(x => x !== id) });
      get().showToast('Dihapus dari wishlist', '🤍');
    } else {
      set({ wishlist: [...wl, id] });
      get().showToast('Ditambahkan ke wishlist', '❤️');
    }
  },

  showToast: (msg, icon = '✅') => {
    set({ toastMsg: `${icon} ${msg}`, toastVisible: true });
    setTimeout(() => set({ toastVisible: false }), 3000);
  },

  openModal: (content) => set({ modal: { open: true, content } }),
  closeModal: () => set({ modal: { open: false, content: null } }),
}));

export default useStore;
