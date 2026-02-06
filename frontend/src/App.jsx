import { useState, useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import { isTokenExpiringSoon, refreshToken } from './lib/api'
import Login from './screens/Login/Login'
import Signup from './screens/Signup/Signup'
import ForgotPassword from './screens/ForgotPassword/ForgotPassword'
import UpdateProfile from './screens/UpdateProfile/UpdateProfile'
import Home from './screens/Home/Home'
import AppNavbar from './components/AppNavbar'
import Materials from './screens/Materials/Materials'
import MaterialsSend from './screens/MaterialsSend/MaterialsSend'
import MaterialsSendUpload from './screens/MaterialsSendUpload/MaterialsSendUpload'
import QuizSend from './screens/QuizSend/QuizSend'
import MaterialsValidate from './screens/MaterialsValidate/MaterialsValidate'
import QuizValidate from './screens/QuizValidate/QuizValidate'
import ManageSubjects from './screens/ManageSubjects/ManageSubjects'
import ManageNotices from './screens/ManageNotices/ManageNotices'
import ManagePlans from './screens/ManagePlans/ManagePlans'
import ManageSubjectEdit from './screens/ManageSubjectEdit/ManageSubjectEdit'
import ManageNoticeEdit from './screens/ManageNoticeEdit/ManageNoticeEdit'
import ManagePlanEdit from './screens/ManagePlanEdit/ManagePlanEdit'
import PlansOverview from './screens/PlansOverview/PlansOverview'
import NotesCenter from './screens/NotesCenter/NotesCenter'
import GamesCenter from './screens/GamesCenter/GamesCenter'
import GamesIndividual from './screens/GamesIndividual/GamesIndividual'
import GamesIndividualPlay from './screens/GamesIndividualPlay/GamesIndividualPlay'
import GamesSurvivor from './screens/GamesSurvivor/GamesSurvivor'
import GamesSurvivorPlay from './screens/GamesSurvivorPlay/GamesSurvivorPlay'
import Stats from './screens/Stats/Stats'
import Ranking from './screens/Ranking/Ranking'
import Shop from './screens/Shop/Shop'
import ProductDetail from './screens/ProductDetail/ProductDetail'
import Cart from './screens/Cart/Cart'
import Checkout from './screens/Checkout/Checkout'
import VendorRegistration from './screens/VendorRegistration/VendorRegistration'
import ManageProducts from './screens/ManageProducts/ManageProducts'
import VendorOrders from './screens/VendorOrders/VendorOrders'
import AdminCategories from './screens/AdminCategories/AdminCategories'
import AdminVendors from './screens/AdminVendors/AdminVendors'
import RoleRoute from './components/RoleRoute'

const ProtectedRoute = ({ isAllowed, redirectTo, children }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

const PublicRoute = ({ isAllowed, redirectTo, children }) => {
  if (isAllowed) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

const AppLayout = ({ user, onLogout }) => (
  <>
    <AppNavbar user={user} onLogout={onLogout} />
    <Outlet />
  </>
)

function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('essd_user')
    return saved ? JSON.parse(saved) : null
  })

  const handleAuthenticated = (user, token) => {
    setCurrentUser(user)
    localStorage.setItem('essd_user', JSON.stringify(user))
    localStorage.setItem('essd_token', token)
    localStorage.setItem('essd_token_time', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
  }

  const handleUserUpdated = (user) => {
    setCurrentUser(user)
    localStorage.setItem('essd_user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('essd_user')
    localStorage.removeItem('essd_token')
    localStorage.removeItem('essd_token_time')
  }

  // Verifica e renova o token automaticamente a cada 5 minutos
  useEffect(() => {
    if (!currentUser) return

    const checkAndRefreshToken = async () => {
      if (isTokenExpiringSoon()) {
        const success = await refreshToken()
        if (!success) {
          handleLogout()
        }
      }
    }

    // Verifica imediatamente
    checkAndRefreshToken()

    // Configura verificação periódica
    const interval = setInterval(checkAndRefreshToken, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [currentUser])

  return (
    <BrowserRouter>
      <div className="page">
        <main className="content">
          <Routes>
            <Route
              path="/signup"
              element={(
                <PublicRoute isAllowed={!!currentUser} redirectTo="/home">
                  <Signup onAuthenticated={handleAuthenticated} />
                </PublicRoute>
              )}
            />
            <Route
              path="/login"
              element={(
                <PublicRoute isAllowed={!!currentUser} redirectTo="/home">
                  <Login onAuthenticated={handleAuthenticated} />
                </PublicRoute>
              )}
            />
            <Route
              path="/forgot-password"
              element={(
                <PublicRoute isAllowed={!!currentUser} redirectTo="/home">
                  <ForgotPassword />
                </PublicRoute>
              )}
            />
            <Route
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <AppLayout user={currentUser} onLogout={handleLogout} />
                </ProtectedRoute>
              )}
            >
              <Route path="/home" element={<Home user={currentUser} onLogout={handleLogout} />} />
              <Route path="/profile" element={<UpdateProfile user={currentUser} onUserUpdated={handleUserUpdated} />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/materials/send" element={<MaterialsSend />} />
              <Route path="/materials/send/:type" element={<MaterialsSendUpload />} />
              <Route path="/materials/quiz/send" element={<QuizSend />} />
              <Route path="/materials/validate" element={<MaterialsValidate />} />
              <Route path="/materials/validate/quiz" element={<QuizValidate />} />
              <Route path="/manage/subjects" element={<ManageSubjects />} />
              <Route path="/manage/subjects/:id/edit" element={<ManageSubjectEdit />} />
              <Route path="/manage/notices" element={<ManageNotices />} />
              <Route path="/manage/notices/:id/edit" element={<ManageNoticeEdit />} />
              <Route path="/manage/plans" element={<ManagePlans />} />
              <Route path="/manage/plans/:id/edit" element={<ManagePlanEdit />} />
              <Route path="/plans" element={<PlansOverview />} />
              <Route path="/notes" element={<NotesCenter />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/games" element={<GamesCenter />} />
              <Route path="/games/individual" element={<GamesIndividual />} />
              <Route path="/games/individual/play" element={<GamesIndividualPlay />} />
              <Route path="/games/survivor" element={<GamesSurvivor />} />
              <Route path="/games/survivor/play" element={<GamesSurvivorPlay />} />
              
              {/* E-shop Routes */}
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              
              {/* Vendor Routes */}
              <Route path="/vendor/register" element={<VendorRegistration />} />
              <Route path="/vendor/products" element={
                <RoleRoute user={currentUser} requiredRole={['vendor', 'admin']}>
                  <ManageProducts />
                </RoleRoute>
              } />
              <Route path="/vendor/orders" element={
                <RoleRoute user={currentUser} requiredRole={['vendor', 'admin']}>
                  <VendorOrders />
                </RoleRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/categories" element={
                <RoleRoute user={currentUser} requiredRole="admin">
                  <AdminCategories />
                </RoleRoute>
              } />
              <Route path="/admin/vendors" element={
                <RoleRoute user={currentUser} requiredRole="admin">
                  <AdminVendors />
                </RoleRoute>
              } />
            </Route>
            <Route
              path="*"
              element={currentUser ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
