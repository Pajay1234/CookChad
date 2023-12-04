import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/commonstyles.css'
import '../components/postpagestyles.css'
import Taskbar from '../components/Taskbar'

interface User { 
    name: string
}

/*
interface Post { 
    caption: string,
    content: string,
    creator: string,
    recipe: string
}
*/

const PostPage = () => {
    //const [post, setPost] = useState<Post | null>(null);
    const [post, setPost] = useState<any>({});
    const [user, setUser] = useState<any>({});
    const { postId } = useParams();

    useEffect(() => {
        
        
        const getData = async () => {
            try {
                const post = await axios.get(`/api/post/getPost/${postId}`)
                setPost(post.data);
                const user = await axios.get(`/api/user/getUser/${post?.data.creator}`)
                setUser(user.data)

            }
            catch (error) {
                console.log(error)
            }
        }
        
        getData();
        
        }, [])
  return (
    <div className = "pageContainer">
        <Taskbar />
        <div className = "postPageContainer">
            <div className = "postPageLeft">
                <div className = "postContainer2">
                    <img src={post?.content} />
                    <p> <strong>{user?.name}</strong> : {post?.caption} </p>
                </div>
            </div>
            <div className = "postPageRight">
                <p> {post?.recipe} </p>
            </div>
            <div className = "postPageRight2">
                <p> {post?.recipe} </p>
            </div>
        </div>
    </div>
  )
}

export default PostPage