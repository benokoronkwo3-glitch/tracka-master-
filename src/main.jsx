import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

const App       = lazy(() => import('./App.jsx'))
const SchoolApp = lazy(() => import('./SchoolApp.jsx'))

function Root() {
  const p = new URLSearchParams(window.location.search)
  const schoolId = p.get('school')
  const stored = localStorage.getItem('tracka_school_client')
  if (schoolId) { localStorage.setItem('tracka_school_client', schoolId); return <SchoolApp /> }
  if (stored) return <SchoolApp />
  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0f172a'}}/>}>
      <Root />
    </Suspense>
  </React.StrictMode>
)
