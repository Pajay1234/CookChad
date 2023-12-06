import React from 'react'
import axios from 'axios'
import '../components/commonstyles.css'
import { useNavigate } from 'react-router-dom'



const Taskbar = () => {
    const navigate = useNavigate()

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();


        try {
           localStorage.removeItem('token');
           navigate("/");
           console.log("clicky");
        }
        catch (error) {
            console.log(error);
        }
    }

    const createPost = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        navigate('/create-post')
    }
    
    return (
        <div className="taskBar">
            <div className="innerTaskBar">
                <div className = "taskBarLeft">
                    <button onClick={createPost}>create post</button>
                </div>
                <div className = "taskBarRight">
                    <button onClick={(e) => handleSubmit(e)}>logout</button>
                </div>
            </div>
        </div>
    )
}

export default Taskbar