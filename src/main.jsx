import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

const App       = lazy(() => import('./App.jsx'))
const ChurchApp = lazy(() => import('./ChurchApp.jsx'))
const SchoolApp = lazy(() => import('./SchoolApp.jsx'))

function Root() {
  const p = new URLSearchParams(window.location.search)
  const churchId = p.get('church')
  const schoolId = p.get('school')
  const storedChurch = localStorage.getItem('tracka_church_client')
  const storedSchool = localStorage.getItem('tracka_school_client')

  if (churchId) { localStorage.setItem('tracka_church_client', churchId); return <ChurchApp /> }
  if (storedChurch) return <ChurchApp />
  if (schoolId) { localStorage.setItem('tracka_school_client', schoolId); return <SchoolApp /> }
  if (storedSchool) return <SchoolApp />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0f172a'}}/>}>
      <Root />
    </Suspense>
  </React.StrictMode>
)
