import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import '../components/poststyles.css'
import LikeIcon from '../assets/icons/like.png'
import LikedIcon from '../assets/icons/liked.png'
import Option from '../assets/icons/option.png'

interface PostProps {
  postId: string,
  caption: string,
  content: string,
  tags?: string[],
  likes?: Map<string, boolean> | any,
  comments?: Array<string>,
  userId: string
}

const Post = ({ postId, caption, content, userId, tags, likes, comments }: PostProps) => {

  const [user, setUser] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const likeCount = Object.keys(likes).length;
  const isLiked = Boolean(likes[userId]);
  const navigate = useNavigate();

  const navigateToPost = () => {
    navigate(`/post/${postId}`);
  }

  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  }

  const handleDelete = async () => {
    try {
      console.log("Deleting post...");
      setShowOptions(!showOptions);
      const response = await axios.delete(`/api/post/delete/${postId}`);
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  const handleLike = async () => {
    try {
      console.log("Liking post...");
      const response = await axios.patch(`/api/post/like/${postId}`, { userId: userId });
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }

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
    <div className="postContainer" >
      <div className="imgContainer">
        <img className="img" src={content} />
      </div>
      <h1 className="captionContainer">
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
          <div>
            <img src={Option} className='w-5 h-5 hover:scale-110' onClick={handleShowOptions} />
            {showOptions && (
              <div className="absolute bg-white border rounded-md shadow-md">
                <div className="flex flex-col">
                  <div className="p-2 hover:bg-gray-100 cursor-pointer">Edit</div>
                  <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleDelete}>Delete</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Post