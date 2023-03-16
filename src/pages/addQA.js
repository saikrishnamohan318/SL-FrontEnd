import React, { useState, useContext } from 'react';
import contextApi from '../contextApi';
import { useNavigate } from 'react-router-dom';
import Welcomecomp from '../components/welcomeComp';
import './addQA.css';
import Loading from '../components/loading';

function Addqa(){
    const { dataById, id } = useContext(contextApi);
    const navigate = useNavigate();
    const [isLoading1, setIsLoading1] = useState(false);
    const [formValues,setFormValues] = useState([{question: '', answer: ''}]);
    
    //to add a new form
    const Addform = (e) => {
        e.preventDefault();
        setFormValues([...formValues, {question: '', answer: ''}])
    }
    //to remove a form
    const Removeform = (index) => {
        let list = [...formValues];
        list.splice(index, 1);
        setFormValues(list);
    }
    //maintaining state to formvalues 
    const Changeform = (e, index) => {
        let list = [...formValues];
        list[index][e.target.name] = e.target.value;
        setFormValues(list);
    }

    //saving data to database
    const saveFormData = (e) => {
        e.preventDefault();
        let formdiv = document.getElementById('formdiv');
        let saveBtn = document.getElementById('saveBtn');
        let start = document.getElementById('start');
        let ss = document.getElementById('ss');
        formValues.filter( async (ele)=>{
            if(ele.question === '' || ele.answer === ''){
                alert('Enter question and answer');
                return;
            }else{
                setIsLoading1(true);
                await fetch('https://sl-backend.onrender.com/data/saveData', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id: id, qa: formValues})
                })
                formdiv.style.display = 'none';
                saveBtn.style.display = 'none';
                start.style.display = 'block';
                ss.style.display = 'block';
            }
        })
        setIsLoading1(false);
    }

    //getting data by Id and redirecting to QAS page
    const startTask = async (e) => {
        e.preventDefault();
        setIsLoading1(true);
        if(id){
            dataById(id);
            localStorage.setItem("id", id);
            navigate('/qas');
        }
    }
    return(
        <>
        {isLoading1 ? <Loading /> : (
            <>
            <Welcomecomp />
            <form>
                <div id='formdiv'>
                    {formValues.map((ele,index)=>{
                        return (
                            <div key={index} className='formfields'>
                                <textarea className='textarea' name='question' placeholder='Enter Question' value={ele.question} onChange={(e)=>Changeform(e, index)}/>
                                <textarea className='textarea' name='answer' placeholder='Enter Answer' value={ele.answer} onChange={(e)=>Changeform(e, index)}/>
                                {formValues.length > 1 && <button className='removeBtn' onClick={()=>Removeform(index)}>Remove</button>}
                            </div>
                        )
                    })}
                    <button className='addBtn' onClick={Addform}>Add Question & Answer</button>
                </div>
                <button className='saveBtn' onClick={(e)=>saveFormData(e)} id='saveBtn'>Save</button>
                <p className='ss' id='ss' style={{display:'none'}}>Saved Successfully</p>
                <button className='start' id='start' style={{display:'none'}} onClick={startTask}>Start</button>          
            </form>
            </>
        )}
        </>
    )
}

export default Addqa;