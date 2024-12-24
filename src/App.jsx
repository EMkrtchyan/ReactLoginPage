import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import MainPage from "./components/MainPage";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <div className="App">
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
      </div>
    </>
  )
}

export default App
