import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './mail.css';
import Welcomecomp from '../components/welcomeComp';

function Mail({ cf, dt }){
    const navigate = useNavigate();
    const [values, setValues] = useState('');
    const [ueData,setUeData] = useState('');

    //getting available Id data
    useEffect(()=>{
        const id = localStorage.getItem('id');
        if(id){
            fetch(`https://sl-back-end.vercel.app/data/getDataById/${id}`).then(res=>res.json()).then(data=>{
                setUeData(data.data);
                if(data.data.QA){
                    navigate('/qas');
                }
            });
        }
    })

    //checking email is available in database
    var handleClick = async () => {
        try {
            const res = await fetch("https://sl-back-end.vercel.app/email/emailcheck", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: values})
            })
            var result = await res.json();
            result.id && localStorage.setItem('id', result.id);
            var para = document.getElementById('para');
            if(result.status === 'added email'){
                alert(result.status);
                setValues('');
                para.style.display = 'none';
                cf();
            }else if(result.status === 'email already exsists'){
                para.style.display = 'block';
            }else {
                alert(result.status);
                para.style.display = 'none';
            }
        }catch(err) {
            alert('Enter valid email');
            console.log(err);
        }
    }

    //getting user entered email data
    const gd = () => {
        dt(values, ueData);
        navigate("/qas");
    }
    return(
        <>
        <Welcomecomp />
        <div className="maildiv">
            <p className="para" id="para" style={{display:'none'}}>Email already exsists<button className='gyd' onClick={gd}>Get your data</button></p>
            <input type='text' className='email' placeholder='Enter email'value={values} onChange={e=>setValues(e.target.value)}/><br/>
            <button className="submitBtn" onClick={handleClick}>Submit</button>
        </div>
        </>
    )
}
export default Mail;