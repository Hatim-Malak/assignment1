import React from 'react'
import { Routes,Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import Navbar from "./components/Navbar.jsx"
import { useAuthstore } from './store/useAuthStore.js'
import { useEffect } from 'react'
import {Loader} from "lucide-react"
import { Toaster } from 'react-hot-toast'
import AboutPage from './pages/AboutPage.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import ClientsPage from './pages/ClientsPage.jsx'
import ActivityPage from './pages/ActivityPage.jsx'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth} = useAuthstore()

  useEffect(() => {
    checkAuth()

  }, [checkAuth])
  
  console.log({authUser})
  if(isCheckingAuth&&!authUser){
    return(
      <div className=' flex justify-center items-center h-[607px]'>
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className= "">
      {authUser && <Navbar />}
      <Routes>
        <Route path='/' element={authUser?<HomePage/>:<Navigate to="/login" />}/>
        <Route path='/login' element={!authUser?<LoginPage/>:<Navigate to="/" />}/>
        <Route path='/projects' element={authUser?<ProjectsPage/>:<Navigate to='/login'/>}/>
        <Route path='/tasks' element={authUser?<TasksPage/>:<Navigate to='/login'/>}/>
        <Route path='/clients' element={authUser?<ClientsPage/>:<Navigate to='/login'/>}/>
        <Route path='/activity' element={authUser?<ActivityPage/>:<Navigate to='/login'/>}/>
        <Route path='/About' element={<AboutPage/>}/>
      </Routes>
      <Toaster/>
    </div>
  )
}

export default App
