import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../components/poststyles.css'
import LikeIcon from '../assets/icons/like.png'
import LikedIcon from '../assets/icons/liked.png'

interface PostProps {
  postId: string,
  caption: string,
  content: string,
  creatorId: string,
  likes?: Map<string, boolean> | any,
  comments?: Array<string>,
  userId: string

}
const Post = ({postId, caption, content, creatorId, likes, comments, userId}: PostProps) => {

  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const [isLiked, setIsLiked] = useState(Boolean(likes[creatorId])); 
  
  const navigateToPost = () => {
    navigate(`/post/${postId}`);
  
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const response: any = await axios.get(`/api/user/getUser/${creatorId}`);
        setUser(response.data.name);
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }

  }, [])

  const handleLike = async () => {
    try {
      console.log("Liking post...");
      const response = await axios.post(`/api/post/like/${postId}`, { userId: userId });
      console.log(response);
      await setIsLiked(!isLiked);
      if (isLiked) {
        await setLikeCount(likeCount - 1);
      }
      else {
        await setLikeCount(likeCount + 1);
      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div className ="postContainer" >
      <div className = "imgContainer" onClick={navigateToPost}>
        <img className = "img" src={content} />
      </div>
      <h1 className = "captionContainer" onClick={navigateToPost}>
        <strong>{user}:</strong> {caption}
      </h1>
      <div>
        <div className="flex">
          <div className="mr-auto flex items-center justify-center gap-2">
            {isLiked ?
              <img src={LikedIcon} className='w-5 h-5 hover:scale-110' onClick={handleLike} /> :
              <img src={LikeIcon} className='w-5 h-5 hover:scale-110' onClick={handleLike} />
            }
            {likeCount}
          </div>
        </div>
      </div>
    </div>
  ) 
}

export default Post