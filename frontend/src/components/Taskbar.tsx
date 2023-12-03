import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../components/commonstyles.css'



const Taskbar = () => {
    return (
        <div className = "box">
            <div className = "innerBox">
                <div className = "basicText"></div> 
                <input className = "input" placeholder = "Search..."/>
            </div>
        </div>
    ) 
}

export default Taskbar