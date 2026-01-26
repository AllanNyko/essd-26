import { useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Login from './screens/Login/Login'
import Signup from './screens/Signup/Signup'
import ForgotPassword from './screens/ForgotPassword/ForgotPassword'
import UpdateProfile from './screens/UpdateProfile/UpdateProfile'
import Home from './screens/Home/Home'
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
              path="/home"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <Home user={currentUser} onLogout={handleLogout} />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/profile"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <UpdateProfile user={currentUser} onUserUpdated={handleUserUpdated} />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/materials"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <Materials />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/materials/send"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <MaterialsSend />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/materials/send/:type"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <MaterialsSendUpload />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/materials/quiz/send"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <QuizSend />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/materials/validate"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <MaterialsValidate />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/materials/validate/quiz"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <QuizValidate />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/manage/subjects"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <ManageSubjects />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/manage/subjects/:id/edit"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <ManageSubjectEdit />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/manage/notices"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <ManageNotices />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/manage/notices/:id/edit"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <ManageNoticeEdit />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/manage/plans"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <ManagePlans />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/manage/plans/:id/edit"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <ManagePlanEdit />
                </ProtectedRoute>
              )}
            />
            <Route
              path="/plans"
              element={(
                <ProtectedRoute isAllowed={!!currentUser} redirectTo="/login">
                  <PlansOverview />
                </ProtectedRoute>
              )}
            />
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
