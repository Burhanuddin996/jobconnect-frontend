import { useEffect, useState } from 'react'
import '../App.css'
import { apiFetch } from '../api'

function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function loadApplications() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/applications/my?page=0&size=20')
      setApplications(data.content)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(function () {
    loadApplications()
  }, [])

  function statusClass(status) {
    if (status === 'SELECTED') return 'status-selected'
    if (status === 'REJECTED') return 'status-rejected'
    if (status === 'SHORTLISTED' || status === 'INTERVIEW') return 'status-progress'
    return 'status-applied'
  }

  return (
    <div className="container">
      <div className="hero">
        <h2>My Applications</h2>
      </div>

      {loading ? <p className="msg">Loading...</p> : null}
      {error ? <p className="msg">{error}</p> : null}
      {(!loading && !error && applications.length === 0) ? (
        <p className="msg">You haven't applied to any jobs yet.</p>
      ) : null}

      <div className="jobs">
        {applications.map(function (app) {
          return (
            <div className="card" key={app.id}>
              <h3>{app.jobTitle}</h3>
              <p className="company">{app.candidateName}</p>
              <p className="meta">
                Applied on {new Date(app.appliedAt).toLocaleDateString()}
              </p>
              <p className={'status-badge ' + statusClass(app.status)}>
                {app.status}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyApplicationsPage