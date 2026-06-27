import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'

const p = new URLSearchParams(window.location.search)
const schoolId = p.get('school')
const clientId = p.get('client')
const churchId = p.get('church')

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

const isSchool = !!localStorage.getItem('tracka_school_client')
const isChurch = !!localStorage.getItem('tracka_church_client')

const SchoolApp = lazy(() => import('./SchoolApp.jsx'))
const ChurchApp = lazy(() => import('./ChurchApp.jsx'))
const App       = lazy(() => import('./App.jsx'))

const ActiveApp = isSchool ? SchoolApp : isChurch ? ChurchApp : App

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0f172a'}}/>}>
      <ActiveApp />
    </Suspense>
  </React.StrictMode>
)
