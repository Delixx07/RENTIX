import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Modal from './components/Modal';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Detail from './pages/Detail';
import Cart from './pages/Cart';
import ListItem from './pages/ListItem';
import HowItWorks from './pages/HowItWorks';
import Login from './pages/Login';
import Register from './pages/Register';
import Trust from './pages/Trust';
import Promo from './pages/Promo';
import Dashboard from './pages/Dashboard';
import useStore from './store/useStore';

export default function App() {
  const initAuth = useStore((s) => s.initAuth);
  useEffect(() => { initAuth(); }, [initAuth]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/browse"        element={<Browse />} />
        <Route path="/product/:id"   element={<Detail />} />
        <Route path="/cart"          element={<Cart />} />
        <Route path="/list-item"     element={<ListItem />} />
        <Route path="/how-it-works"  element={<HowItWorks />} />
        <Route path="/trust"         element={<Trust />} />
        <Route path="/promo"         element={<Promo />} />
        <Route path="/dashboard"     element={<Dashboard />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="*"              element={<Home />} />
      </Routes>
      <Toast />
      <Modal />
    </BrowserRouter>
  );
}
