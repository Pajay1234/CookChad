import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const CreatePost = () => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const navigate = useNavigate();

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
    
        try { 
          const token = localStorage.getItem('token')
          const userResponse: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });

          const post = {
            caption: caption, 
            content: image,
            userId: userResponse.data._id
          };
          let response = null;
          setIsSubmitting(true);
          console.log("clicky");
          if (!isSubmitting) {
            response = await axios.post('/api/post/createPost', post);
          }
          if (response) navigate('/dashboard')
          console.log(response);
        }
        catch (error) {
          console.log(error);
        }
    }

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
    <div className = 'createPostContainer'>
        <input type="text" placeholder="Caption" onChange={(e) => setCaption(e.target.value)}/>
        <input type="file" accept="image/jpeg" onChange={(e) => handleImageChange(e)} placeholder="Image" />   
        <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
        

    </div>
    
    ) 
 
}

export default CreatePost