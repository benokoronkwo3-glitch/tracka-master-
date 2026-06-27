import React from 'react'
import ReactDOM from 'react-dom/client'

const p = new URLSearchParams(window.location.search)
const schoolId = p.get('school')
const clientId = p.get('client')
const churchId = p.get('church')

// Clear conflicting stored values when a specific param is in URL
if (schoolId) {
  localStorage.removeItem('tracka_client')
  localStorage.removeItem('tracka_church_client')
  localStorage.setItem('tracka_school_client', schoolId)
}
if (clientId) {
  localStorage.removeItem('tracka_school_client')
  localStorage.removeItem('tracka_church_client')
  localStorage.setItem('tracka_client', clientId)
}
if (churchId) {
  localStorage.removeItem('tracka_client')
  localStorage.removeItem('tracka_school_client')
  localStorage.setItem('tracka_church_client', churchId)
}

const storedSchool  = localStorage.getItem('tracka_school_client')
const storedChurch  = localStorage.getItem('tracka_church_client')

async function init() {
  let Component

  if (storedSchool) {
    const mod = await import('./SchoolApp.jsx')
    Component = mod.default
  } else if (storedChurch) {
    const mod = await import('./ChurchApp.jsx')
    Component = mod.default
  } else {
    const mod = await import('./App.jsx')
    Component = mod.default
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Component />
    </React.StrictMode>
  )
}

init()
