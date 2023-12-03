import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../components/commonstyles.css'



const Taskbar = () => {
    const navigate = useNavigate();
    const navToCreatePost = () => {
        navigate('/create_post')
    }

    return (
        <div className="box">
            <div className="innerBox">
                <input className="input" placeholder="Search..." />
                <button onClick={navToCreatePost}>Create Post</button>

            </div>
        </div>
    )
}

export default Taskbar