import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import ErrorBoundary from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import SignIn from './components/AuthSignIn'
import SignUp from './components/AuthSignUp'
import Index from './components/Index'
import AuthRecoverPassword from './components/AuthRecoverPassword'
import AuthConfirmMail from './components/AuthConfirmMail'
import UserProfileEdit from './components/UserProfileEdit'
import UserList from './components/UserList'
import Photos from './components/Photos'
import Albums from './components/Albums'
import Shared from './components/Shared'
import SharedPublic from './components/SharedPublic'
import Friends from './components/Friends'
import Favorites from './components/Favorites'
import Trash from './components/Trash'
import Notifications from './components/Notifications'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
    <Router>
      <div className="app">
        <Routes>
          {/* Trang mặc định chuyển đến dashboard */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />
          
          {/* Trang đăng nhập */}
          <Route path="/sign-in" element={<SignIn />} />

          {/* Trang đăng ký */}
          <Route path="/sign-up" element={<SignUp />} />

          {/* Trang khôi phục mật khẩu */}
          <Route path="/recover-password" element={<AuthRecoverPassword />} />

          {/* Trang xác nhận email */}
          <Route path="/confirm-mail" element={<AuthConfirmMail />} />

          {/* Trang chỉnh sửa profile */}
              <Route path="/profile-edit" element={
                <ProtectedRoute>
                  <UserProfileEdit />
                </ProtectedRoute>
              } />
          
              {/* Trang danh sách người dùng */}
              <Route path="/user-list" element={
                <ProtectedRoute>
                  <UserList />
                </ProtectedRoute>
              } />

              {/* Trang ảnh */}
              <Route path="/photos" element={
                <ProtectedRoute>
                  <Photos />
                </ProtectedRoute>
              } />

              {/* Trang album */}
              <Route path="/albums" element={
                <ProtectedRoute>
                  <Albums />
                </ProtectedRoute>
              } />

              {/* Trang đã chia sẻ */}
              <Route path="/shared" element={
                <ProtectedRoute>
                  <Shared />
                </ProtectedRoute>
              } />

              {/* Trang xem chia sẻ công khai */}
              <Route path="/shared/:token" element={<SharedPublic />} />

              {/* Trang bạn bè */}
              <Route path="/friends" element={
                <ProtectedRoute>
                  <Friends />
                </ProtectedRoute>
              } />

              {/* Trang yêu thích */}
              <Route path="/favorites" element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              } />

              {/* Trang thùng rác */}
              <Route path="/trash" element={
                <ProtectedRoute>
                  <Trash />
                </ProtectedRoute>
              } />

              {/* Trang thông báo */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              } />

          {/* Redirect các đường dẫn không tồn tại về trang đăng nhập */}
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </div>
    </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
