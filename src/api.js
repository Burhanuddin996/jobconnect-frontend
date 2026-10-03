const API = 'https://jobconnect-backend-p74k.onrender.com/api'

export function saveSession(data) {
  localStorage.setItem('token', data.token)
  localStorage.setItem('role', data.role)
  localStorage.setItem('email', data.email)
  localStorage.setItem('userId', data.userId)
}

export function getToken() {
  return localStorage.getItem('token')
}

export function getRole() {
  return localStorage.getItem('role')
}
export function getUserId() {
  return localStorage.getItem('userId')
}

export function isLoggedIn() {
  return !!getToken()
}

export function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('role')
  localStorage.removeItem('email')
  localStorage.removeItem('userId')
}

export async function apiFetch(path, options) {
  const opts = options || {}
  const headers = opts.headers || {}
  headers['Content-Type'] = 'application/json'
  const token = getToken()
  if (token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  const res = await fetch(API + path, {
    method: opts.method || 'GET',
    headers: headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  })
  const body = await res.json()
  if (!res.ok) {
    throw new Error(body.message || 'Request failed with status ' + res.status)
  }
  return body.data
}
export async function uploadFile(path, file) {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(API + path, {
    method: 'POST',
    headers: token ? { 'Authorization': 'Bearer ' + token } : {},
    body: formData
  })
  const body = await res.json()
  if (!res.ok) {
    throw new Error(body.message || 'Upload failed with status ' + res.status)
  }
  return body.data
}
