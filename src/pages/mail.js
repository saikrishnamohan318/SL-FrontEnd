import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './mail.css';
import contextApi from '../contextApi';
import Welcomecomp from '../components/welcomeComp';
import Loading from '../components/loading';

function Mail(){
    const navigate = useNavigate();
    const { dataByMail, dataById, setId } = useContext(contextApi);
    const [values, setValues] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    //getting available Id data
    useEffect(()=>{
        const id = localStorage.getItem('id');
        if(id){
            dataById(id);
            navigate('/qas');
        }
    })

    //checking email is available in database
    var handleClick = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("https://sl-back-end.vercel.app/email/emailcheck", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: values})
            })
            setIsLoading(false);
            var result = await res.json();
            result.id && setId(result.id);
            var para = document.getElementById('para');
            if(result.status === 'added email'){
                alert(result.status);
                setValues('');
                para.style.display = 'none';
                navigate('/addqa');
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
        setIsLoading(true);
        dataByMail(values);
        navigate("/qas");
    }
    return(
        <>
        {isLoading ? <Loading /> : (
            <>
            <Welcomecomp />
            <div className="maildiv">
                <p className="para" id="para" style={{display:'none'}}>Email already exsists<button className='gyd' onClick={gd}>Get your data</button></p>
                <input type='text' className='email' placeholder='Enter email'value={values} onChange={e=>setValues(e.target.value)}/><br/>
                <button className="submitBtn" onClick={handleClick}>Submit</button>
            </div>
            </>
        )}
        </>
    )
}
export default Mail;