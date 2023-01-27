import React, { useState } from 'react';
import Welcomecomp from '../components/welcomeComp';
import QA from './QA';
import './addQA.css';

function Addqa(){
    const [formValues,setFormValues] = useState([{question: '', answer: ''}]);
    const [apiData,setApiData] = useState([]);
    const [bool,setBool] = useState(true);
    
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
        let id = localStorage.getItem('id');
        formValues.filter( async (ele)=>{
            if(ele.question === '' || ele.answer === ''){
                alert('Enter question and answer');
            }else{
                await fetch('https://sl-back-end.vercel.app/data/saveData', {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({id: id, qa: formValues})
                })
                document.getElementById('formdiv').style.display = 'none';
                document.getElementById('saveBtn').style.display = 'none';
                document.getElementById('start').style.display = 'block';
                document.getElementById('ss').style.display = 'block';
            }
        })
    }

    //getting data by Id and redirecting to QAS page
    const startTask = async (e) => {
        e.preventDefault();
        const id = localStorage.getItem('id');
        if(id){
            await fetch(`https://sl-back-end.vercel.app/data/getDataById/${id}`).then(res=>res.json()).then(data=>setApiData(data.data.QA));
            setBool(false);
        }
    }
    return(
        <>
        {bool ? (
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
        ) : (
            <QA ad={apiData}/>
        )}
        </>
    )
}

export default Addqa;