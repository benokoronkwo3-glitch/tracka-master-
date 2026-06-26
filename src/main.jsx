import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

const p = new URLSearchParams(window.location.search)
const schoolId = p.get('school')
const storedSchool = localStorage.getItem('tracka_school_client')

let AppToRender = App

if (schoolId || storedSchool) {
  if (schoolId) localStorage.setItem('tracka_school_client', schoolId)
  const { default: SchoolApp } = await import('./SchoolApp.jsx')
  AppToRender = SchoolApp
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppToRender />
  </React.StrictMode>
)
