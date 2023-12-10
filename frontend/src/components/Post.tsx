import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
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
  userId: string,
  creatorId: string
}

const Post = ({ postId, caption, content, userId, tags, likes, comments, creatorId }: PostProps) => {

  const [user, setUser] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [likeCount, setLikeCount] = useState(Object.keys(likes).length);
  const isYourPost = userId == creatorId;
  const [isLiked, setIsLiked] = useState(Boolean(likes[userId])); 
  const navigate = useNavigate();

  // Navigate to the corresponding post page
  const navigateToPost = () => {
    navigate(`/post/${postId}`);
  }

  // Set the state to show options
  const handleShowOptions = () => {
    setShowOptions(!showOptions);
  }


  // Delete the post from the database by doing an API call to the backend and reload
  const handleDelete = async () => {
    try {
      console.log("clicky");
      //setShowOptions(!showOptions);
      const body = {
        pid: postId,
        cid: creatorId
      }
      const response = await axios.post('/api/post/delete', {pid: postId, cid:creatorId});
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }

  // Increment the like count and set the corresponding state
  const handleLike = async () => {
    try {
      console.log("Liking post...");
      const response = await axios.patch(`/api/post/like/${postId}`, { userId: userId });
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

  // Get the post creator's name
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

  return (
    <div className="postContainer" >
      
      {/* Display the post's content inclduing the username, caption, and image*/} 
      <div className="imgContainer">
        <img className="img" src={content} />
      </div>
      <h1 className="captionContainer">
        <strong><Link to={`/user-profile/${creatorId}`}>{user}</Link>:</strong> {caption}
      </h1>
      <div>
        <div className="flex">
          <div className="mr-auto flex items-center justify-center gap-2">
            {/* Set the liked icon depending on the state of the isLiked state*/} 
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
                {/* Set dropdown options for deleting (if it is the current user's post) and navigate to post */} 
                <div className="flex flex-col">
                  {isYourPost && <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleDelete}>Delete</div> }
                  <div className="p-2 hover:bg-gray-100 cursor-pointer" onClick={navigateToPost}>Navigate To Post</div>
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