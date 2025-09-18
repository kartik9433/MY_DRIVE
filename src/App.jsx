import React from "react";
import './App.css';
import Drive from "./components/Drive";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
          <Routes>
             <Route path="/" element={<Drive/>}/>
          </Routes>
    </BrowserRouter>
  );
}

export default App;
