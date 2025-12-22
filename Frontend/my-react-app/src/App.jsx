import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import EventManagementPage from "./pages/EventManagement/EventManagementPage.jsx"
function App() {

  return (
<div className='min-h-screen bg-gray-100 p-4'>
  <EventManagementPage />
</div>
  )
}

export default App
