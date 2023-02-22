import React from "react";
import './pagination.css';

function Pagination({ totalPosts, postsPerPage, paginate }){
    const pageNumbers = [];

    for (let i=1; i<=Math.ceil(totalPosts / postsPerPage); i++){
        pageNumbers.push(i);
    }

    return(
        <div style={{marginTop: '50px'}}>
            <ul>
                {pageNumbers.map(number => {
                    return(
                    <li key={number} className='number' id="number" onClick={()=>paginate(number)}>
                        <a href="##" style={{textDecoration:'none'}}>{number}</a>
                    </li>)
                })}
            </ul>
        </div>
    )
}
export default Pagination;