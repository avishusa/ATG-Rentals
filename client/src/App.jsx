import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
          <Header />

    <Routes>
      <Route path='/' element={<Home/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/about' element={<About/>} />
      <Route element={<PrivateRoute/>}>
      <Route path='/Profile' element={<Profile />} />
      </Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
