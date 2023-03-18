import React, { useEffect, useState, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import contextApi from '../contextApi';
import Pagination from "../components/pagination";
import Welcomecomp from "../components/welcomeComp";
import './QA.css';
import Loading from "../components/loading";

import useSpeechToText from 'react-hook-speech-to-text';

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;

function QAS() {
    const { data, dataById } = useContext(contextApi);
    const [isLoading2, setIsLoading2] = useState(false);
    useEffect(()=>{
        setIsLoading2(true);
        const id = localStorage.getItem('id');
        if(id){
            dataById(id);
            setIsLoading2(false);
        }
    },[dataById])

    //removing Id from localstroage
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("id");
        setIsLoading2(true);
        navigate("/");
    }

    //pagination code
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(1);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = data && data.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        setTranscript('');
        showAns.style.display = 'none';
    }

    //text-to-speech code
    const textToSpeech = (e) => {
        var utterance = new SpeechSynthesisUtterance(e.target.value);
        speechSynthesis.speak(utterance);
    }   

    //speech to text
    const [transcript,setTranscript] = useState('');
    const {
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
      } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });
    const showAns = document.getElementById('showAns');

    const handleResultsChange = useCallback(
        (results) => {
          setTranscript(results[results.length - 1]?.transcript || '');
        },
        [setTranscript]
    );

    useEffect(() => {
        handleResultsChange(results);
    }, [results, handleResultsChange]);
    
    const startSpeechTT = () => {
        startSpeechToText();
        showAns.style.display = 'none';
    }

    const stopSpeechTT = () => {
        stopSpeechToText();
        showAns.style.display = 'block';
        console.log(transcript);
    }

    //display answers
    const [bool,setBool] = useState(false);
    return(
        <>
        {isLoading2 ? <Loading /> : (
            <>
            {currentPosts && currentPosts.map((ele, index)=>{
                return(
                    <div key={index}>
                    <Welcomecomp />
                    <div className="qadiv">
                        <div className="qnumbtn">
                            <h3>Question - {currentPage}</h3>
                            <button onClick={logout} className='logout'>Logout</button>
                        </div>
                        <button className="lq" onClick={(e)=>textToSpeech(e)} value={ele.question}>Listen{<br/>}Question</button>
                        {isRecording ? <p className="mic">recording...</p> : <p className="mic">Mic is off</p>}
                        <div className='rec'>
                            <button className="startrec" id="startrec" onClick={startSpeechTT}>Start</button>
                            <button className="stoprec" id="stoprec" onClick={stopSpeechTT} disabled={!isRecording}>Stop</button>
                        </div>
                        <div className="urAns">
                            <p className='yAns'>Your Answer :-</p>
                            <p className="transcript">{transcript}</p>
                            <button onClick={()=>setTranscript('')} className='clear'>Clear</button>
                        </div>
                        <div id="showAns" style={{display: 'none'}}>
                            <button className="showAns" onClick={()=>setBool(!bool)}>{bool ? <span>Hide Answer</span> : <span>Show Answer</span>}</button>
                            {bool ? (
                                <div className="urAns" id="urAns">
                                    <p className="yAns">Actual Answer :-<button className="la" onClick={(e)=>textToSpeech(e)} value={ele.answer}>Listen{<br/>}Answer</button></p>
                                    <p className="transcript">{ele.answer}</p>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <Pagination postsPerPage={postsPerPage} totalPosts={data.length} paginate={paginate}/>
                    </div>
                )
            })}
            </>
        )}
        </>
    )
}
export default QAS;