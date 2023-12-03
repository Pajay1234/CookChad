import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
    <div>

    <img src={post?.content} />
    <p> <strong>{user?.name}</strong> : {post?.caption} </p>
    <p> {post?.recipe} </p>
    
    </div>
  )
}

export default PostPage