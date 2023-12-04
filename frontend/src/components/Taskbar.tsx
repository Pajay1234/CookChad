import React from 'react'
import axios from 'axios'
import '../components/commonstyles.css'
import { useNavigate } from 'react-router-dom'

interface TaskbarProps {
    userID: string
  
  }

const Taskbar = ({ userID }:TaskbarProps) => {
    const navigate = useNavigate()

    const handleSubmitLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
           localStorage.removeItem('token');
           navigate("/");
        }
        catch (error) {
            console.log(error);
        }
    }

    const handleSubmitProfile = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        try {
           navigate(`/user-profile/${userID}`);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="box">
            <div className="innerBox">
                <div className="basicText"></div>
                <button onClick={(e) => handleSubmitProfile(e)}>Profile</button>
                <input className="input" placeholder="Search..." />
                <button onClick={(e) => handleSubmitLogout(e)}>logout</button>
            </div>
        </div>
    )
}

export default Taskbar