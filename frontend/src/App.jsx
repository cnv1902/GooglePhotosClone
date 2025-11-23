import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import SignIn from './components/AuthSignIn'
import SignUp from './components/AuthSignUp'
import Index from './components/Index'
import AuthRecoverPassword from './components/AuthRecoverPassword'
import AuthConfirmMail from './components/AuthConfirmMail'
import UserProfileEdit from './components/UserProfileEdit'
import UserList from './components/UserList'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Trang mặc định chuyển đến dashboard */}
          <Route path="/" element={<Index />} />
          
          {/* Trang đăng nhập */}
          <Route path="/sign-in" element={<SignIn />} />
          
          {/* Trang đăng ký */}
          <Route path="/sign-up" element={<SignUp />} />

          {/* Trang đăng ký */}
          <Route path="/sign-up" element={<SignUp />} />

          {/* Trang khôi phục mật khẩu */}
          <Route path="/recover-password" element={<AuthRecoverPassword />} />

          {/* Trang xác nhận email */}
          <Route path="/confirm-mail" element={<AuthConfirmMail />} />

          {/* Trang chỉnh sửa profile */}
          <Route path="/profile-edit" element={<UserProfileEdit />} />
          
          {/* Trang chỉnh sửa profile */}
          <Route path="/user-list" element={<UserList />} />

          {/* Redirect các đường dẫn không tồn tại về trang đăng nhập */}
          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
