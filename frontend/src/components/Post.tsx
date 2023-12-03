import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../components/poststyles.css'
import LikeIcon from '../../public/icons/like.png'

interface PostProps {
  postId: string,
  caption: string,
  content: string,
  userId: string

}
const Post = ({postId, caption, content, userId}: PostProps) => {

  const [user, setUser] = useState("");
  const navigate = useNavigate();
  
  const navigateToPost = () => {
    navigate(`/post/${postId}`);
  
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response: any = await axios.get(`/api/user/getUser/${userId}`);
        setUser(response.data.name);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }

  }, [])

  return (
    <div className ="postContainer" onClick={navigateToPost}>
      <div className = "imgContainer">
        <img className = "img" src={content} />
      </div>
      <h1 className = "captionContainer">
        <strong>{user}:</strong> {caption}
      </h1>
    </div>
  ) 
}

export default Post