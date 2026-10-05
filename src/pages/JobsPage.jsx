import { useEffect, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom'
import AutocompleteInput from '../components/AutocompleteInput'

const API = 'https://jobconnect-backend-p74k.onrender.com/api'

const CITY_SUGGESTIONS = [
  'Hyderabad', 'Bangalore', 'Bengaluru', 'Mumbai', 'Delhi', 'Pune',
  'Chennai', 'Kolkata', 'Noida', 'Gurgaon', 'Ahmedabad', 'Remote'
]

const TITLE_SUGGESTIONS = [
  'Java Developer', 'Frontend Developer', 'Backend Developer',
  'Full Stack Developer', 'React Developer', 'Spring Boot Developer',
  'DevOps Engineer', 'QA Engineer', 'Data Analyst', 'Software Engineer',
  'Backend Intern', 'Software Intern'
]

function JobsPage() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')

  const [showFilters, setShowFilters] = useState(false)
  const [minSalary, setMinSalary] = useState('')
  const [maxSalary, setMaxSalary] = useState('')
  const [jobType, setJobType] = useState('')
  const [sort, setSort] = useState('postedDate,desc')

  async function loadJobs(targetPage) {
    setLoading(true)
    setError('')
    try {
      const hasSearch = keyword.trim() || location.trim()
      const hasFilter = minSalary || maxSalary || jobType

      let url
      const params = new URLSearchParams()
      params.append('page', targetPage)
      params.append('size', 6)
      params.append('sort', sort)

      if (hasFilter) {
        if (minSalary) params.append('minSalary', minSalary)
        if (maxSalary) params.append('maxSalary', maxSalary)
        if (jobType) params.append('jobType', jobType)
        url = API + '/jobs/filter?' + params
      } else if (hasSearch) {
        if (keyword.trim()) params.append('keyword', keyword.trim())
        if (location.trim()) params.append('location', location.trim())
        url = API + '/jobs/search?' + params
      } else {
        url = API + '/jobs?' + params
      }

      const res = await fetch(url)
      if (!res.ok) {
        throw new Error('Server returned ' + res.status)
      }
      const body = await res.json()
      setJobs(body.data.content)
      setTotalPages(body.data.totalPages)
      setPage(targetPage)
    } catch (e) {
      setError('Could not load jobs: ' + e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(function () {
    loadJobs(0)
  }, [])

  function handleSearch() {
    loadJobs(0)
  }

  function clearFilters() {
    setMinSalary('')
    setMaxSalary('')
    setJobType('')
    loadJobs(0)
  }

  return (
    <div className="container">
      <div className="hero">
        <h2>Find your dream job</h2>
        <p>Search thousands of openings from top companies</p>
      </div>

      <div className="search">
        <AutocompleteInput
          placeholder="Job title or keyword"
          value={keyword}
          onChange={setKeyword}
          suggestions={TITLE_SUGGESTIONS}
        />
        <AutocompleteInput
          placeholder="Location"
          value={location}
          onChange={setLocation}
          suggestions={CITY_SUGGESTIONS}
        />
        <button onClick={handleSearch}>Search</button>
        <button className="secondary" onClick={function () { setShowFilters(!showFilters) }}>
          {showFilters ? 'Hide filters' : 'Filters'}
        </button>
      </div>

      {showFilters ? (
        <div className="filters">
          <input
            type="number"
            placeholder="Min salary"
            value={minSalary}
            onChange={function (e) { setMinSalary(e.target.value) }}
          />
          <input
            type="number"
            placeholder="Max salary"
            value={maxSalary}
            onChange={function (e) { setMaxSalary(e.target.value) }}
          />
          <select value={jobType} onChange={function (e) { setJobType(e.target.value) }}>
            <option value="">Any job type</option>
            <option value="FULL_TIME">FULL TIME</option>
            <option value="PART_TIME">PART TIME</option>
            <option value="INTERNSHIP">INTERNSHIP</option>
            <option value="CONTRACT">CONTRACT</option>
          </select>
          <select value={sort} onChange={function (e) { setSort(e.target.value) }}>
            <option value="postedDate,desc">Newest first</option>
            <option value="postedDate,asc">Oldest first</option>
            <option value="salaryMin,desc">Salary: high to low</option>
            <option value="salaryMin,asc">Salary: low to high</option>
          </select>
          <button onClick={function () { loadJobs(0) }}>Apply filters</button>
          <button className="secondary" onClick={clearFilters}>Clear</button>
        </div>
      ) : null}

      {loading ? <p className="msg">Loading...</p> : null}
      {error ? <p className="msg">{error}</p> : null}
      {(!loading && !error && jobs.length === 0) ? <p className="msg">No jobs found.</p> : null}

      <div className="jobs">
        {jobs.map(function (job) {
                   return (
            <div className="card" key={job.id} onClick={function () { navigate('/jobs/' + job.id) }}>
              <h3>{job.title}</h3>
              <p className="company">{job.companyName}</p>
              <p className="meta">
                {job.location}
              {job.salaryMin ? ' • ₹' + Number(job.salaryMin).toLocaleString('en-IN') + ' - ₹' + Number(job.salaryMax).toLocaleString('en-IN') : ''}
              {job.jobType ? ' • ' + job.jobType.replace('_', ' ') : ''}
              </p>
              <p className="desc">{job.description}</p>
            </div>
          )
        })}
      </div>

      {totalPages > 1 ? (
        <div className="pagination">
          <button disabled={page === 0} onClick={function () { loadJobs(page - 1) }}>
            Previous
          </button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page + 1 >= totalPages} onClick={function () { loadJobs(page + 1) }}>
            Next
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default JobsPage
