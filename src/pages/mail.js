import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import './mail.css';
import contextApi from '../contextApi';
import Welcomecomp from '../components/welcomeComp';
import Loading from '../components/loading';

function Mail(){
    const navigate = useNavigate();
    const { dataById, setId, setData } = useContext(contextApi);
    const [values, setValues] = useState('');
    const [otp,setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSendOtp, setShowSendOtp] = useState(false);
    const [showOtpField, setShowOtpField] = useState(false);
    const [showSbt,setShowSbt] = useState(false);
    const [changeFn, setChangeFn] = useState(false);

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
            if(values === ''){
                alert('Enter email');
                setIsLoading(false);
                return;
            }
            const res = await fetch("https://sl-backend.onrender.com/email/emailcheck", {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({email: values})
            })
            setIsLoading(false);
            var result = await res.json();
            if(result.status === 'register'){
                setShowSbt(true);
                setShowSendOtp(true);
            }
            if(result.status === 'email already exsists'){
                alert(result.status);
                sendOtp();
                setChangeFn(true);
            }else {
                alert(result.status);
            }
        }catch(err) {
            alert('Enter valid email');
            console.log(err);
        }
    }

    //send otp to email
    const sendOtp = async () => {
        await fetch('https://sl-backend.onrender.com/email/sendOTP',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: values})
        })
        .then(res=>res.json())
        .then(data=>{
            alert(data.message);
            setShowSendOtp(false);
            setShowSbt(true);
            setShowOtpField(true);
        })
    }

    //verify otp and save email
    const handleOtpChange = async (e) => {
        e.preventDefault();
        if(otp === ''){
            alert('enter OTP');
            setIsLoading(false);
            return;
        }
        await fetch('https://sl-backend.onrender.com/email/saveEmail', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({email: values, verified: true, otp: otp})
        }).then(res=>res.json())
        .then(dt=>{
            alert(dt.status);
            if(dt.id){
                setId(dt.id);
                navigate('/addqa');
            }
        });
        
    }

    //comparing otp and getting user entered email data
    const gd = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if(otp === ''){
            alert('enter OTP');
            setIsLoading(false);
            return;
        }
        await fetch('https://sl-backend.onrender.com/email/compareOTP', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({otp: otp})
        }).then(res=>res.json())
        .then(async data=>{
            if(data.status === 'otp verified'){
                await fetch(`https://sl-backend.onrender.com/data/getDataByMail/${values}`)
                .then(response=>response.json())
                .then(data=>{
                    if(data.data.QA.length === 0){
                        setId(data.data._id);
                        navigate('/addqa');
                    }else{
                        setData(data.data.QA);
                        localStorage.setItem("id", data.data._id);
                    }
                });
            }else if(data.status === 'incorrect otp'){
                alert('Invalid OTP');
            }
            setIsLoading(false);
        })
    }
    return(
        <>
        {isLoading ? <Loading /> : (
            <>
            <Welcomecomp />
            <div className="maildiv">
                <input type='text' className='email' placeholder='Enter email' value={values} onChange={e=>setValues(e.target.value)}/>{showSendOtp && <button className="sendotp" onClick={sendOtp}>Send OTP</button>}<br/>
                {showOtpField && <form style={{margin: '10px auto 0 auto'}}>
                    <input className='otp' type='text' maxLength={4} placeholder='Enter OTP' onChange={(e)=>setOtp(e.target.value)}/>
                    <button className="verifyBtn" onClick={changeFn ? (e)=>gd(e) : (e)=>handleOtpChange(e)}>Verify</button>
                    </form>}<br/>
                <button style={{display: showSbt ? 'none' : 'block'}} className="submitBtn" onClick={handleClick}>Submit</button>
            </div>
            </>
        )}
        </>
    )
}
export default Mail;