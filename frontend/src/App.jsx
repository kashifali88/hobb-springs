import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import PageNotFound from './pages/PageNotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import PublicRoute from './components/PublicRoute';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import Cart from './pages/Cart';
import AdminDashboard from './pages/admin/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword'; 
import UserDashboard from './pages/user/UserDashboard'; 
import AdminRoute from './components/admin/AdminRoute';
import CreateProduct from './pages/admin/CreateProduct';
import UpdateProduct from './pages/admin/UpdateProduct';
import CreateCategory from './pages/admin/CreateCategory';
import Users from './pages/admin/Users';
import Products from './pages/admin/Products';
import UserOrders from './pages/user/UserOrders';
import AdminOrders from './pages/admin/AdminOrders';
import Product from './pages/Product';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Search from './pages/SearchPage';

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">

        {/* Header */}
        <Header />

        <main className="flex-1">
          <Routes>

            {/* PUBLIC ONLY (not logged in) */}
            <Route element={<PublicRoute />}>
              <Route path='/sign-in' element={<SignIn />} />
              <Route path='/sign-up' element={<SignUp />} />
              <Route path='/forgot-password' element={<ForgotPassword />} />
              <Route path='/reset-password/:token' element={<ResetPassword />} />
            </Route>

            {/* USER DASHBOARD (Protected) */}
            <Route path='/dashboard/user' element={<ProtectedRoute />}>
              <Route index element={<UserDashboard />} />
              <Route path='profile' element={<Profile />} />
              <Route path='orders' element={<UserOrders />} />
            </Route>

            {/* ADMIN DASHBOARD */}
            <Route path='/dashboard/admin' element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path='create-product' element={<CreateProduct />} />
              <Route path='update-product/:slug' element={<UpdateProduct />} />
              <Route path='create-category' element={<CreateCategory />} />
              <Route path='users' element={<Users />} />
              <Route path='products' element={<Products />} />
              <Route path='orders' element={<AdminOrders />} />
            </Route>
            
              <Route path='/product/:slug' element={<Product />} />

            {/* OTHER PROTECTED */}
            <Route element={<ProtectedRoute />}>
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path="/order/success" element={<OrderSuccess />} />
            </Route>

            {/* PUBLIC (everyone) */}
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/policy' element={<Policy />} />
            <Route path='/search' element={<Search />} />

            {/* 404 */}
            <Route path='*' element={<PageNotFound />} />

          </Routes>
        </main>

        {/* Footer */}
        <Footer />

      </div>
    </BrowserRouter>
  )
}

export default App;