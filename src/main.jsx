import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ChurchApp from './ChurchApp.jsx'

const mode = localStorage.getItem('tracka_mode');
const AppToLoad = mode === 'church' ? ChurchApp : App;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppToLoad/>
  </React.StrictMode>
)
