// src/routes/AppRoutes.tsx
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from '../Components/Loaders/Loader';
import CartPage from '../Pages/HomePage/CartPage';
import ShopPage from '../Pages/HomePage/ShopPage';

const Home = lazy(() => import('../Pages/HomePage/Home'));
const NotFound = lazy(() => import('../Pages/StatusPages/NotFoundPage/NotFound'));
const PunchOutRedirect = lazy(() => import('../Components/PunchoutRedirect'));

const AppRoutes = () => (
  <Router>
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/punchout" element={<PunchOutRedirect />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/shop" element={<ShopPage />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRoutes;
