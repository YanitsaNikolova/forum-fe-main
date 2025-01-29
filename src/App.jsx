import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css'
import './bootstrap.min.css'
import Menu from './components/Menu'
import Login from './components/Login'
import Register from './components/Register'
import Topics from './components/Topics'
import Topic from './components/Topic'
import NewTopic from './components/NewTopic'
import EditTopic from './components/EditTopic'
import EditReply from './components/EditPost'
import AdminPanel from './components/AdminPanel'

function App() {
  
  let [cart, updateCart] = useState([]);

  return (
    <> <BrowserRouter>
      <Menu />
     
        <Routes>
          <Route path="/Login" element={<Login />} /> 
          <Route path="/Register" element={<Register />} />
          <Route path="/Topics" element={<Topics />} />
          <Route path="/Topic" element={<Topic />} />
          <Route path="/NewTopic" element={<NewTopic />} />
          <Route path="/EditTopic" element={<EditTopic />} />
          <Route path="/EditPost" element={<EditReply />} />
          <Route path="/AdminPanel" element={<AdminPanel />} />
          <Route path="/" element={<Topics />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
