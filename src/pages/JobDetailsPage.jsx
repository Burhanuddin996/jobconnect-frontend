import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import '../App.css'
import { apiFetch, isLoggedIn, getRole } from '../api'

const API = 'https://jobconnect-backend-p74k.onrender.com/api'

function JobDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [applying, setApplying] = useState(false)
  const [applyMessage, setApplyMessage] = useState('')
  const [applyError, setApplyError] = useState('')

  async function loadJob() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(API + '/jobs/' + id)
      if (!res.ok) {
        throw new Error('Server returned ' + res.status)
      }
      const body = await res.json()
      setJob(body.data)
    } catch (e) {
      setError('Could not load this job: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(function () {
    loadJob()
  }, [id])

  async function handleApply() {
    setApplying(true)
    setApplyMessage('')
    setApplyError('')
    try {
      await apiFetch('/jobs/' + id + '/apply', { method: 'POST' })
      setApplyMessage('Applied successfully!')
    } catch (e) {
      setApplyError(e.message)
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return <div className="container"><p className="msg">Loading...</p></div>
  }

  if (error) {
    return <div className="container"><p className="msg">{error}</p></div>
  }

  if (!job) {
    return <div className="container"><p className="msg">Job not found.</p></div>
  }

  const loggedIn = isLoggedIn()
  const role = getRole()

  return (
    <div className="container">
      <Link to="/jobs">&larr; Back to jobs</Link>

      <div className="card" style={{ marginTop: 16 }}>
        <h3>{job.title}</h3>
        <p className="company">{job.companyName}</p>
        <p className="meta">
          {job.location}
          {job.salaryMin ? ' price ' + job.salaryMin + ' to ' + job.salaryMax : ''}
          {job.jobType ? ' type ' + job.jobType.replace('_', ' ') : ''}
        </p>
        <p className="desc">{job.description}</p>

        {loggedIn && role === 'JOB_SEEKER' ? (
          <div style={{ marginTop: 16 }}>
            <button onClick={handleApply} disabled={applying}>
              {applying ? 'Applying...' : 'Apply for this job'}
            </button>
            {applyMessage ? <p className="success-text">{applyMessage}</p> : null}
            {applyError ? <p className="error-text">{applyError}</p> : null}
          </div>
        ) : null}

        {!loggedIn ? (
          <p className="msg" style={{ marginTop: 16 }}>
            <Link to="/login">Log in</Link> as a job seeker to apply.
          </p>
        ) : null}

        {loggedIn && role !== 'JOB_SEEKER' ? (
          <p className="msg" style={{ marginTop: 16 }}>
            Only job seekers can apply to jobs.
          </p>
        ) : null}
      </div>
    </div>
  )
}

export default JobDetailsPage
