import { useEffect, useState } from 'react'
import '../App.css'
import { apiFetch, uploadFile } from '../api'


function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [headline, setHeadline] = useState('')
  const [summary, setSummary] = useState('')
  const [location, setLocation] = useState('')
  const [education, setEducation] = useState('')

  const [uploading, setUploading] = useState(false)
  const [uploadMessage, setUploadMessage] = useState('')

  async function loadProfile() {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/candidates/profile')
      setProfile(data)
    } catch (e) {
      if (e.message.indexOf('No candidate profile') !== -1) {
        setProfile(null)
      } else {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(function () {
    loadProfile()
  }, [])

  async function handleCreateProfile(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await apiFetch('/candidates/profile', {
        method: 'POST',
        body: {
          headline: headline,
          summary: summary,
          location: location,
          education: education,
          experienceYears: 0,
          resumeUrl: '',
          linkedinUrl: '',
          skillIds: []
        }
      })
      setProfile(data)
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) {
      return
    }
    setUploading(true)
    setUploadMessage('')
    setError('')
    try {
      const data = await uploadFile('/candidates/profile/resume', file)
      setProfile(data)
      setUploadMessage('Resume uploaded successfully.')
    } catch (e) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return <div className="container"><p className="msg">Loading...</p></div>
  }

  if (!profile) {
    return (
      <div className="container">
        <div className="hero">
          <h2>Create your profile</h2>
          <p>Set this up once, then you can upload your resume and apply to jobs.</p>
        </div>
        <div className="auth-page">
          <form className="auth-form" onSubmit={handleCreateProfile}>
            {error ? <p className="error-text">{error}</p> : null}
            <input placeholder="Headline (e.g. Aspiring Java Developer)" value={headline}
              onChange={function (e) { setHeadline(e.target.value) }} required />
            <input placeholder="Summary" value={summary}
              onChange={function (e) { setSummary(e.target.value) }} />
            <input placeholder="Location" value={location}
              onChange={function (e) { setLocation(e.target.value) }} />
            <input placeholder="Education" value={education}
              onChange={function (e) { setEducation(e.target.value) }} />
            <button type="submit">Create profile</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="hero">
        <h2>My Profile</h2>
      </div>
      <div className="auth-page">
        <div className="auth-form">
          <p><strong>Headline:</strong> {profile.headline}</p>
          <p><strong>Location:</strong> {profile.location}</p>
          <p><strong>Education:</strong> {profile.education}</p>

          <hr />

          <p><strong>Resume:</strong></p>
          {profile.resumeUrl ? (
            <p>
              <a href={'http://localhost:8080' + profile.resumeUrl} target="_blank" rel="noreferrer">
                View current resume
              </a>
            </p>
          ) : (
            <p className="msg">No resume uploaded yet.</p>
          )}

          <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} disabled={uploading} />
          {uploading ? <p className="msg">Uploading...</p> : null}
          {uploadMessage ? <p className="success-text">{uploadMessage}</p> : null}
          {error ? <p className="error-text">{error}</p> : null}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage