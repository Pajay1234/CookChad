import React from 'react'
import axios from 'axios'
import '../components/commonstyles.css'
import { useNavigate, Link } from 'react-router-dom'
import Logo from '../assets/icons/logo.png'

interface TaskbarProps {
    userID: string
}

const Taskbar = ({ userID }: TaskbarProps) => {
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
    
    return (
        // <div className="taskBar">
        //     <div className="innerTaskBar">
        //         <div className="taskBarLeft">
        //             <div>
        //                 <img src={Logo} alt="logo" />
        //             </div>
        //             <button onClick={createPost}>create post</button>
        //         </div>
        //         <button onClick={(e) => handleSubmitProfile(e)}>Profile</button>
        //         <div className="taskBarRight">
        //             <button onClick={(e) => handleSubmit(e)}>logout</button>
        //         </div>
        //     </div>
        // </div>
        <div className="flex py-2 px-16 justify-center items-center bg-[#BD4A09] overflow-x-hidden">
            <div className="mr-auto">
                <Link to='/dashboard'><img src={Logo} alt="logo" className="w-20 h-20" /></Link>
            </div>
            <div className="flex gap-8 text-gray-200">
                <Link to='/create-post' className="hover:underline hover:underline-offset-4">Create Post</Link>
                <Link to={`/user-profile/${userID}`} className="hover:underline hover:underline-offset-4">Profile</Link>
                <button onClick={(e) => handleSubmit(e)} className="hover:underline hover:underline-offset-4">Logout</button>
            </div>
        </div>
    )
}

export default Taskbar