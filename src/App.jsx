import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom'
import './App.css'
import JobsPage from './pages/JobsPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import MyApplicationsPage from './pages/MyApplicationsPage'
import RecruiterDashboardPage from './pages/RecruiterDashboardPage'
import JobDetailsPage from './pages/JobDetailsPage'
import { isLoggedIn, getRole, logout } from './api'

function RequireRole(props) {
  const loggedIn = isLoggedIn()
  const role = getRole()
  if (!loggedIn) {
    return <Navigate to="/login" replace />
  }
  if (props.role && role !== props.role) {
    return <Navigate to="/jobs" replace />
  }
  return props.children
}

function App() {
  const navigate = useNavigate()
  const loggedIn = isLoggedIn()
  const role = getRole()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div>
      <header className="header">
        <h1><Link to="/jobs" className="brand-link">JobConnect</Link></h1>
        <nav className="nav-links">
          <Link to="/jobs">Jobs</Link>
          {loggedIn ? (
            <>
              <Link to="/profile">Profile</Link>
              {role === 'JOB_SEEKER' ? <Link to="/my-applications">My Applications</Link> : null}
              {role === 'RECRUITER' ? <Link to="/recruiter/dashboard">Dashboard</Link> : null}
              <button className="nav-button" onClick={handleLogout}>Logout ({role})</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<RequireRole><ProfilePage /></RequireRole>} />
        <Route path="/my-applications" element={<RequireRole role="JOB_SEEKER"><MyApplicationsPage /></RequireRole>} />
        <Route path="/recruiter/dashboard" element={<RequireRole role="RECRUITER"><RecruiterDashboardPage /></RequireRole>} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
      </Routes>
    </div>
  )
}

export default App