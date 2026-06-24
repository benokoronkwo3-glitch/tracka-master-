import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'

const App = lazy(() => import('./App.jsx'))
const ChurchApp = lazy(() => import('./ChurchApp.jsx'))

function Root() {
  const params = new URLSearchParams(window.location.search)
  const churchId = params.get('church')
  const stored = localStorage.getItem('tracka_church_client')
  const isChurch = !!(churchId || stored)
  if (churchId) localStorage.setItem('tracka_church_client', churchId)
  return isChurch ? <ChurchApp /> : <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<div style={{minHeight:'100vh',background:'#0f172a'}}/>}>
      <Root />
    </Suspense>
  </React.StrictMode>
)
