import React, { useEffect, useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'
import Post from '../components/Post'
import '../components/dashstyles.css'
import '../components/commonstyles.css'
import Taskbar from '../components/Taskbar'


const DashboardScreen = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('')
    const [posts, setPosts] = useState([])

    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
            setName(response.data.name);
            const posts: any = await axios.post('/api/post/getPosts', {});
            setPosts(posts.data);
          } catch (error: any) {
            if (error.response && error.response.status === 401) {
              localStorage.removeItem('token');
              navigate('/');
            }
          }
        }
        else {
          navigate('/')
        }
      };

      fetchData();
    }, []);

  

  return (
    <div className = "pageContainer">
      <Taskbar />
      <div className = "dashContainer">
        {posts.map((post: any) => (<Post key={post._id} caption={post.caption} content={post.content} userId={post.creator} />))}
      </div>
    </div>
  )

 
}

export default DashboardScreen