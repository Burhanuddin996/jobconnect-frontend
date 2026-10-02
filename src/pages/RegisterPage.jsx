import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { apiFetch } from '../api'

function RegisterPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('JOB_SEEKER')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: { name: name, email: email, password: password, phone: phone, role: role }
      })
      setSuccess('Account created. Redirecting to login...')
      setTimeout(function () { navigate('/login') }, 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create account</h2>
        {error ? <p className="error-text">{error}</p> : null}
        {success ? <p className="success-text">{success}</p> : null}
        <input
          placeholder="Full name"
          value={name}
          onChange={function (e) { setName(e.target.value) }}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={function (e) { setEmail(e.target.value) }}
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={function (e) { setPassword(e.target.value) }}
          required
        />
        <input
          placeholder="Phone (optional)"
          value={phone}
          onChange={function (e) { setPhone(e.target.value) }}
        />
        <select value={role} onChange={function (e) { setRole(e.target.value) }}>
          <option value="JOB_SEEKER">I am a Job Seeker</option>
          <option value="RECRUITER">I am a Recruiter</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
        <p>Already have an account? <Link to="/login">Log in</Link></p>
      </form>
    </div>
  )
}

export default RegisterPage