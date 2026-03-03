import React, { useEffect } from 'react'
import backBut from '../../assets/backBut.webp' 
import './back.css'
import { useNavigate } from "react-router-dom";
function backButton(props) {
    const navigate = useNavigate();
    useEffect(()=>{
        if (props.top) {
            document.getElementById('backButtonWrap').style.top = props.top
        }
        if (props.left) {
            document.getElementById('backButtonWrap').style.left = props.left
        }
        if (props.filter) {
            document.getElementById('backButtonWrap').style.filter = props.filter
        }
        if (props.color) {
            document.getElementById('backtxt').style.color = props.color
        }
        if (!props.textDisplay) {
            document.getElementById('backtxt').style.display = 'none'
        }
        if (props.data) {
            document.getElementById('backtxt').innerText = props.data
        }
        
    },[])
  return (
    <div onClick={()=>history.back()} id='backButtonWrap' className='backButtonWrap'>
      <img src={backBut} alt="" srcset="" />
      <h5 id='backtxt' >Back</h5>
    </div>
  )
}

export default backButton
