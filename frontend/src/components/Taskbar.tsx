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
    console.log("from taskbar:" + userID);

    // Remove the token from local storage and navigate to the login page
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

        <div className="flex py-2 px-16 justify-center items-center bg-[#BD4A09] overflow-x-hidden">
            <div className="mr-auto">
                {/* Display the CookChad logo */}
                <Link to='/dashboard'><img src={Logo} alt="logo" className="w-20 h-20" /></Link>
            </div>
            <div className="flex gap-8 text-gray-200 text-md">
                 {/* Display the create post, profile button, and logout */}
                <Link to='/create-post' className="hover:underline hover:underline-offset-4">Create Post</Link>
                <Link to={`/user-profile/${userID}`} className="hover:underline hover:underline-offset-4">Profile</Link>
                <button onClick={(e) => handleSubmit(e)} className="hover:underline hover:underline-offset-4">Logout</button>
            </div>
        </div>
    )
}

export default Taskbar