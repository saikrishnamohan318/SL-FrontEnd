import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import contextApi from './contextApi';
import Addqa from './pages/addQA';
import Mail from './pages/mail';
import QAS from './pages/QA';

function App() {
  const [data,setData] = useState('');
  const [id, setId] = useState('');

  //getting data by mail
  const dataByMail = async (email) => {
    await fetch(`https://sl-backend.onrender.com/data/getDataByMail/${email}`)
    .then(response=>response.json())
    .then(data=>{
      setData(data.data.QA);
      localStorage.setItem("id", data.data._id);
    });
  }

  //getting data by id
  const dataById = async (id) => {
    await fetch(`https://sl-backend.onrender.com/data/getDataById/${id}`)
    .then(response=>response.json())
    .then(data=>setData(data.data.QA));
  }
  return (
    <contextApi.Provider value={{data, dataByMail, dataById, id, setId }}>
      <div className="App">
        <Router>
            <Routes>
              <Route path='/' element={<Mail />} />
              <Route path='/addqa' element={<Addqa />} />
              <Route path='/qas' element={<QAS />} />
            </Routes>
          </Router>
      </div>
    </contextApi.Provider>
  );
}

export default App;