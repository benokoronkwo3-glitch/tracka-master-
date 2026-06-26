import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

function Root() {
  const p = new URLSearchParams(window.location.search)
  const schoolId = p.get('school')
  const storedSchool = localStorage.getItem('tracka_school_client')
  const clientId = p.get('client')
  const storedClient = localStorage.getItem('tracka_client')

  if (schoolId) localStorage.setItem('tracka_school_client', schoolId)
  if (clientId) localStorage.setItem('tracka_client', clientId)

  const isSchool = !!(schoolId || storedSchool)

  if (isSchool) {
    const SchoolApp = React.lazy(() => import('./SchoolApp.jsx'))
    return (
      <React.Suspense fallback={<div style={{minHeight:'100vh',background:'#78350f'}}/>}>
        <SchoolApp />
      </React.Suspense>
    )
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
