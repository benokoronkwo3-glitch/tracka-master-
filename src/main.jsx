import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChurchApp from './ChurchApp.jsx'

function Root() {
  const params = new URLSearchParams(window.location.search)
  const churchId = params.get('church')
  const storedChurch = localStorage.getItem('tracka_church_client')

  if (churchId) {
    localStorage.setItem('tracka_church_client', churchId)
    return <ChurchApp />
  }

  if (storedChurch) {
    return <ChurchApp />
  }

  return <App />
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)
