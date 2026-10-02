import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'
import { apiFetch, getUserId } from '../api'

function RecruiterDashboardPage() {
  const [company, setCompany] = useState(null)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [companyName, setCompanyName] = useState('')
  const [description, setDescription] = useState('')
  const [website, setWebsite] = useState('')
  const [location, setLocation] = useState('')
  const [industry, setIndustry] = useState('')

  const [title, setTitle] = useState('')
  const [jobDesc, setJobDesc] = useState('')
  const [jobLocation, setJobLocation] = useState('')
  const [salaryMin, setSalaryMin] = useState('')
  const [salaryMax, setSalaryMax] = useState('')
  const [jobType, setJobType] = useState('FULL_TIME')
  const [postMessage, setPostMessage] = useState('')

  async function loadDashboard() {
    setLoading(true)
    setError('')
    try {
      const companies = await apiFetch('/companies')
      const myUserId = Number(getUserId())
      const myCompany = companies.find(function (c) { return c.recruiterId === myUserId })
      setCompany(myCompany || null)

      if (myCompany) {
        const jobsPage = await apiFetch('/jobs?page=0&size=100')
        const myJobs = jobsPage.content.filter(function (j) { return j.companyId === myCompany.id })
        setJobs(myJobs)
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(function () {
    loadDashboard()
  }, [])

  async function handleCreateCompany(e) {
    e.preventDefault()
    setError('')
    try {
      const data = await apiFetch('/companies', {
        method: 'POST',
        body: {
          companyName: companyName,
          description: description,
          website: website,
          location: location,
          industry: industry
        }
      })
      setCompany(data)
    } catch (e) {
      setError(e.message)
    }
  }

  async function handlePostJob(e) {
    e.preventDefault()
    setError('')
    setPostMessage('')
    try {
      await apiFetch('/jobs?companyId=' + company.id, {
        method: 'POST',
        body: {
          title: title,
          description: jobDesc,
          location: jobLocation,
          salaryMin: salaryMin ? Number(salaryMin) : null,
          salaryMax: salaryMax ? Number(salaryMax) : null,
          jobType: jobType,
          active: true
        }
      })
      setPostMessage('Job posted successfully.')
      setTitle('')
      setJobDesc('')
      setJobLocation('')
      setSalaryMin('')
      setSalaryMax('')
      loadDashboard()
    } catch (e) {
      setError(e.message)
    }
  }

  if (loading) {
    return <div className="container"><p className="msg">Loading...</p></div>
  }

  if (!company) {
    return (
      <div className="container">
        <div className="hero">
          <h2>Create your company</h2>
          <p>Set this up once before you can post jobs.</p>
        </div>
        <div className="auth-page">
          <form className="auth-form" onSubmit={handleCreateCompany}>
            {error ? <p className="error-text">{error}</p> : null}
            <input placeholder="Company name" value={companyName}
              onChange={function (e) { setCompanyName(e.target.value) }} required />
            <input placeholder="Description" value={description}
              onChange={function (e) { setDescription(e.target.value) }} />
            <input placeholder="Website" value={website}
              onChange={function (e) { setWebsite(e.target.value) }} />
            <input placeholder="Location" value={location}
              onChange={function (e) { setLocation(e.target.value) }} />
            <input placeholder="Industry" value={industry}
              onChange={function (e) { setIndustry(e.target.value) }} />
            <button type="submit">Create company</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="hero">
        <h2>{company.companyName}</h2>
        <p>Recruiter Dashboard</p>
      </div>

      <div className="auth-page">
        <form className="auth-form" onSubmit={handlePostJob}>
          <h2 style={{ fontSize: '1.1rem' }}>Post a new job</h2>
          {error ? <p className="error-text">{error}</p> : null}
          {postMessage ? <p className="success-text">{postMessage}</p> : null}
          <input placeholder="Job title" value={title}
            onChange={function (e) { setTitle(e.target.value) }} required />
          <input placeholder="Description" value={jobDesc}
            onChange={function (e) { setJobDesc(e.target.value) }} />
          <input placeholder="Location" value={jobLocation}
            onChange={function (e) { setJobLocation(e.target.value) }} />
          <input type="number" placeholder="Min salary" value={salaryMin}
            onChange={function (e) { setSalaryMin(e.target.value) }} />
          <input type="number" placeholder="Max salary" value={salaryMax}
            onChange={function (e) { setSalaryMax(e.target.value) }} />
          <select value={jobType} onChange={function (e) { setJobType(e.target.value) }}>
            <option value="FULL_TIME">FULL TIME</option>
            <option value="PART_TIME">PART TIME</option>
            <option value="INTERNSHIP">INTERNSHIP</option>
            <option value="CONTRACT">CONTRACT</option>
          </select>
          <button type="submit">Post job</button>
        </form>
      </div>

      <div className="hero">
        <h2 style={{ fontSize: '1.3rem' }}>Your posted jobs</h2>
      </div>
      {jobs.length === 0 ? <p className="msg">No jobs posted yet.</p> : null}
      <div className="jobs">
        {jobs.map(function (job) {
          return (
            <div className="card" key={job.id}>
              <h3>{job.title}</h3>
              <p className="meta">{job.location}</p>
              <p className="desc">{job.description}</p>
              <Link to={'/recruiter/jobs/' + job.id + '/applicants'}>View applicants &rarr;</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecruiterDashboardPage