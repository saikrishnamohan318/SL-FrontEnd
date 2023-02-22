import React from "react";
import ReactLoading from 'react-loading';
import './loading.css';

function Loading() {
    return(
        <div className="loading">
            <ReactLoading type="spin" color="#00000" height={100} width={50} />
        </div>
    )
}
export default Loading;