import React, { useEffect, useState } from 'react'
import axios from 'axios'



const CreatePost = () => {
    const [caption, setCaption] = useState('')
    const [image, setImage] = useState('')

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

          const response = await axios.post('/api/post/createPost', post);
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