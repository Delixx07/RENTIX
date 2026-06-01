import { create } from 'zustand';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const useStore = create((set, get) => ({
  cart: [],
  wishlist: [],
  toastMsg: '',
  toastVisible: false,
  modal: { open: false, content: null },

  // ---------- AUTH ----------
  user: null,          // auth.users record (id, email)
  profile: null,       // public.profiles row (full_name, kyc_status, is_student, ...)
  authLoading: true,

  initAuth: async () => {
    if (!isSupabaseConfigured) {
      set({ authLoading: false });
      return;
    }
    const { data } = await supabase.auth.getSession();
    if (data?.session?.user) {
      set({ user: data.session.user });
      await get().loadProfile(data.session.user.id);
    }
    set({ authLoading: false });

    supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      set({ user: u });
      if (u) get().loadProfile(u.id);
      else set({ profile: null });
    });
  },

  loadProfile: async (uid) => {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase.from('profiles').select('*').eq('id', uid).single();
    if (data) set({ profile: data });
  },

  register: async ({ email, password, fullName, phone }) => {
    if (!isSupabaseConfigured) return { ok: false, reason: 'Supabase belum dikonfigurasi.' };
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, phone } },
    });
    if (error) return { ok: false, reason: error.message };
    if (data.user) {
      set({ user: data.user });
      await get().loadProfile(data.user.id);
    }
    return { ok: true, needsConfirm: !data.session };
  },

  login: async ({ email, password }) => {
    if (!isSupabaseConfigured) return { ok: false, reason: 'Supabase belum dikonfigurasi.' };
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, reason: error.message };
    set({ user: data.user });
    await get().loadProfile(data.user.id);
    return { ok: true };
  },

  logout: async () => {
    if (isSupabaseConfigured) await supabase.auth.signOut();
    set({ user: null, profile: null });
    get().showToast('Kamu telah keluar', '👋');
  },

  // Update E-KYC status / student flag on the profile
  updateProfile: async (patch) => {
    const { user } = get();
    if (!user || !isSupabaseConfigured) {
      set((s) => ({ profile: { ...(s.profile || {}), ...patch } }));
      return { ok: true };
    }
    const { error } = await supabase.from('profiles').update(patch).eq('id', user.id);
    if (!error) set((s) => ({ profile: { ...(s.profile || {}), ...patch } }));
    return { ok: !error, reason: error?.message };
  },

  // ---------- CART ----------
  addToCart: (product, opts = {}) => {
    const cart = get().cart;
    const existing = cart.find((i) => i.id === product.id);
    if (existing) {
      set({ cart: cart.map((i) => (i.id === product.id ? { ...i, qty: i.qty + (opts.qty || 1) } : i)) });
    } else {
      set({
        cart: [
          ...cart,
          {
            ...product,
            qty: opts.qty || 1,
            days: opts.days || 1,
            startDate: opts.startDate || null,
            endDate: opts.endDate || null,
          },
        ],
      });
    }
    get().showToast(`${product.name} ditambahkan ke keranjang`, '🛒');
  },

  removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),

  updateQty: (id, delta) =>
    set({
      cart: get().cart.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)),
    }),

  clearCart: () => set({ cart: [] }),

  toggleWishlist: (id) => {
    const wl = get().wishlist;
    if (wl.includes(id)) {
      set({ wishlist: wl.filter((x) => x !== id) });
      get().showToast('Dihapus dari wishlist', '🤍');
    } else {
      set({ wishlist: [...wl, id] });
      get().showToast('Ditambahkan ke wishlist', '❤️');
    }
  },

  // ---------- UI ----------
  showToast: (msg, icon = '✅') => {
    set({ toastMsg: `${icon} ${msg}`, toastVisible: true });
    setTimeout(() => set({ toastVisible: false }), 3000);
  },

  openModal: (content) => set({ modal: { open: true, content } }),
  closeModal: () => set({ modal: { open: false, content: null } }),
}));

export default useStore;
