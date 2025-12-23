import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UserRegistrationTicketsPage from './pages/UserRegistrationTicketsPage'
import AreaRegistrationTicketsPage from './pages/AreaRegistrationTicketsPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/user-registrations" element={<UserRegistrationTicketsPage />} />
        <Route path="/dashboard/area-registrations" element={<AreaRegistrationTicketsPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App