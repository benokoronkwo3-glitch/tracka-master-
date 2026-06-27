import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const p = new URLSearchParams(window.location.search)
const schoolId = p.get('school')
const clientId = p.get('client')

if (schoolId) {
  localStorage.removeItem('tracka_client')
  localStorage.setItem('tracka_school_client', schoolId)
}
if (clientId) {
  localStorage.removeItem('tracka_school_client')
  localStorage.setItem('tracka_client', clientId)
}

const isSchool = !!localStorage.getItem('tracka_school_client')
const SchoolApp = lazy(() => import('./SchoolApp.jsx'))

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isSchool
      ? <Suspense fallback={<div style={{minHeight:'100vh',background:'#78350f'}}/>}><SchoolApp/></Suspense>
      : <App/>
    }
  </React.StrictMode>
)
