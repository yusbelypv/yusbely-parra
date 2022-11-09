import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/presentational/Home"
import Clients from './components/functional/Clients';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/clients" element={<Clients/>} />
        
      </Routes>
    </BrowserRouter>
  )

}

export default App;