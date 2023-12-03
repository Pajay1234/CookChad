import React, { useEffect, useState } from 'react'
import axios from 'axios'
import '../components/poststyles.css'

interface PostProps {
  caption: string,
  content: string,
  userId: string

}
const Post = ({caption, content, userId}: PostProps) => {

  const [user, setUser] = useState("");

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
    <div className ="postContainer">
      <div className = "imgContainer">
        <img src={content} />
      </div>
      <h1 className = "captionContainer">
        <strong>{user}:</strong> {caption}
      </h1>
      
      </div>
  )
}

export default Post