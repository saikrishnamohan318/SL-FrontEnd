import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Addqa from './pages/addQA';
import Mail from './pages/mail';
import QAS from './pages/QA';

function App() {
  //mail page to add Q & A page
  const [bool, setBool] = useState(false);
  const childfn = () => {
    setBool(true);
  }
  
  const [data,setData] = useState('');
  //getting data of exsisting mail and saving Id to localstorage
  const dt = async (email, ud) => {
    if(email){
      await fetch(`https://sl-back-end.vercel.app/data/getDataByMail/${email}`).then(res=>res.json()).then(data=>{
        setData(data.data);
        localStorage.setItem('id', data.data._id);
      });
    }else if(ud) {
      setData(ud);
    }
  }
  return (
    <div className="App">
      <Router>
          <Routes>
            <Route path='/' element={bool ? <Addqa /> : <Mail cf={childfn} dt={dt}/>} />
            <Route path='/qas' element={<QAS mailDt={data.QA}/>} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;