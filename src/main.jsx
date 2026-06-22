import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChurchApp from './ChurchApp.jsx'

const p = new URLSearchParams(window.location.search);
const churchId = p.get('church');
const stored = localStorage.getItem('tracka_church_client');
const isChurch = !!(churchId || stored);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isChurch ? <ChurchApp/> : <App/>}
  </React.StrictMode>
)
