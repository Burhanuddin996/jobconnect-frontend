import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch, saveSession } from '../api'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email: email, password: password }
      })
      saveSession(data)
      navigate('/jobs')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Log in</h2>
        {error ? <p className="error-text">{error}</p> : null}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={function (e) { setEmail(e.target.value) }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={function (e) { setPassword(e.target.value) }}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
        <p>No account? <Link to="/register">Register here</Link></p>
      </form>
    </div>
  )
}

export default LoginPage