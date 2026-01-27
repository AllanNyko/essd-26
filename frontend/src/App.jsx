import { useState } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
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

  const handleAuthenticated = (user) => {
    setCurrentUser(user)
    localStorage.setItem('essd_user', JSON.stringify(user))
  }

  const handleUserUpdated = (user) => {
    setCurrentUser(user)
    localStorage.setItem('essd_user', JSON.stringify(user))
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('essd_user')
  }

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
              <Route path="/games" element={<GamesCenter />} />
              <Route path="/games/individual" element={<GamesIndividual />} />
              <Route path="/games/individual/play" element={<GamesIndividualPlay />} />
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
