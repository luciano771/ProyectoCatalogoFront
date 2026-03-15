import { RouteObject } from 'react-router-dom';
import PublicLayout from '../components/layout/PublicLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import HomePage from '../pages/HomePage';
import PresentacionPage from '../pages/PresentacionPage';
import StorePage from '../pages/StorePage';
import ProductDetailPage from '../pages/ProductDetailPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import PaymentResultPage from '../pages/PaymentResultPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardHomePage from '../pages/dashboard/DashboardHomePage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import CategoriesPage from '../pages/dashboard/CategoriesPage';
import ProductsPage from '../pages/dashboard/ProductsPage';
import OrdersPage from '../pages/dashboard/OrdersPage';
import OrderDetailPage from '../pages/dashboard/OrderDetailPage';
import CargaMasivaPage from '../pages/dashboard/CargaMasivaPage';
import { AuthGuard } from './AuthGuard';

export const routes: RouteObject[] = [
  {
    path: '/presentacion',
    element: <PresentacionPage />
  },
  {
    path: '/',
    element: (
      <PublicLayout>
        <HomePage />
      </PublicLayout>
    )
  },
  {
    path: '/tienda/:slug',
    element: (
      <PublicLayout>
        <StorePage />
      </PublicLayout>
    )
  },
  {
    path: '/tienda/:slug/producto/:productId',
    element: (
      <PublicLayout>
        <ProductDetailPage />
      </PublicLayout>
    )
  },
  {
    path: '/carrito',
    element: (
      <PublicLayout>
        <CartPage />
      </PublicLayout>
    )
  },
  {
    path: '/checkout',
    element: (
      <PublicLayout>
        <CheckoutPage />
      </PublicLayout>
    )
  },
  {
    path: '/resultado-pago',
    element: (
      <PublicLayout>
        <PaymentResultPage />
      </PublicLayout>
    )
  },
  {
    path: '/login',
    element: (
      <PublicLayout>
        <LoginPage />
      </PublicLayout>
    )
  },
  {
    path: '/registro',
    element: (
      <PublicLayout>
        <RegisterPage />
      </PublicLayout>
    )
  },
  {
    path: '/panel',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardHomePage /> },
      { path: 'perfil', element: <ProfilePage /> },
      { path: 'categorias', element: <CategoriesPage /> },
      { path: 'productos', element: <ProductsPage /> },
      { path: 'pedidos', element: <OrdersPage /> },
      { path: 'pedidos/:id', element: <OrderDetailPage /> },
      { path: 'carga-masiva', element: <CargaMasivaPage /> }
    ]
  }
];

