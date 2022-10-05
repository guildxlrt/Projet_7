import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Navbar from '../navbar';
import LeftNav from '../LeftNav';
import { UidContext } from '../appContext';




const Index = () => {
  const uid = useContext(UidContext)

  return (
    <BrowserRouter>
        <Navbar />
        {uid ? <LeftNav/> : null }
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/profil" exact element={<Profil />} />
        </Routes>
    </BrowserRouter>
  )
}

export default Index