import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import contextApi from '../contextApi';
import Pagination from "../components/pagination";
import Welcomecomp from "../components/welcomeComp";
import './QA.css';
import Loading from "../components/loading";

var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
var mic = new SpeechRecognition();

mic.continuous = true;
mic.interimResults = true;

function QAS() {
    const { data, dataById } = useContext(contextApi);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(()=>{
        setIsLoading(true);
        const id = localStorage.getItem('id');
        if(id){
            dataById(id);
            setIsLoading(false);
        }
    },[dataById])

    //removing Id from localstroage
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("id");
        setIsLoading(true);
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
    const [isListening,setIsListening] = useState(false);
    const [transcript,setTranscript] = useState();    

    const startrec = document.getElementById('startrec');
    const stoprec = document.getElementById('stoprec');
    const showAns = document.getElementById('showAns');
    var startRecognition = () => {
        setIsListening(true);
        mic.start();
        startrec.disabled = true;
        stoprec.disabled = false;
        showAns.style.display = 'none';
    }
    mic.onstart = () => {
        console.log('mic is on');
    }
    mic.onspeechend = () => {
        console.log('mic is off');
    }
    mic.onresult = (e) => {
        const tscript = Array.from(e.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
        setTranscript(tscript);
        mic.onerror = (e) => {
            console.log(e.error);
        }
    }
    var stopRecognition = () => {
        setIsListening(false);
        mic.stop();
        startrec.disabled = false;
        stoprec.disabled = true;
        showAns.style.display = 'block';
    }

    //display answers
    const [bool,setBool] = useState(false);
    return(
        <>
        {isLoading ? <Loading /> : (
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
                        {isListening ? <p className="mic">recording...</p> : <p className="mic">Mic is off</p>}
                        <div className='rec'>
                            <button className="startrec" id="startrec" onClick={startRecognition}>Start</button>
                            <button className="stoprec" id="stoprec" onClick={stopRecognition} disabled={!isListening}>Stop</button>
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