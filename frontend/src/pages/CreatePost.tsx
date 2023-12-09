import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../components/createpoststyles.css'
import '../components/commonstyles.css'
import Taskbar from '../components/Taskbar'


const CreatePost = () => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userId, setUserId] = useState('')
    const [submitState, setSubmitState] = useState('submit')
    const [submitEnabled, setSubmitEnabled] = useState(true)

    const navigate = useNavigate();

    
    // Get the user ID from the JWT token
    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
            setUserId(response.data._id);
          } catch (error: any) {
            console.log(error)
          }
        }
        else {
          console.log(token)
        }
      };
  
      fetchData();
    }, []);

    // Create a post, do an API call to the backend and pass those parameters to the backend to create the post in the DB, and navigate to the dashboard
    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        try { 
          setSubmitEnabled(false);
          const token = localStorage.getItem('token')
          const userResponse: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
          setUserId(userResponse.data._id);
          const post = {
            caption: caption, 
            content: image,
            userId: userResponse.data._id
          };
          let response = null;
          setIsSubmitting(true);
          console.log("clicky");
          // Set state to submitting 
          if (!isSubmitting) {
            await setSubmitState('submitting...');
            response = await axios.post('/api/post/createPost', post);
            console.log("sent");
          }
          // Navigate dashboard 
          if (response) navigate('/dashboard')
          console.log(response);
        }
        catch (error) {
          console.log(error);
        }
        setSubmitEnabled(true);
        await setSubmitState('submit');
      
    }

    // Convert the image to a base64 string

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {  
        e.preventDefault();
        
        const image = e.target.files![0];
        const reader = new FileReader();

        reader.onloadend = () => {
            setImage(reader.result as string);
        }
        
        reader.readAsDataURL(image)



    }
    return (
    <div><Taskbar userID={userId}/><div className = 'pageContainer'>
      { /* Area containing the input box, upload image button, and submit button */}
      <div className = "createPostContainer">
        <h1 className = 'leftText2'> Create Post</h1>
        <textarea className = "inputBox" placeholder="Caption" onChange={(e) => setCaption(e.target.value)}/>
        <input type="file" accept="image/jpeg" onChange={(e) => handleImageChange(e)} placeholder="Image" />   
        <button className = "submitButton" disabled={!submitEnabled} type="submit" onClick={(e) => handleSubmit(e)}>{submitState}</button>
      </div>
    </div></div>
    
    ) 
 
}

export default CreatePost