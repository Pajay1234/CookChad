import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'



const UserProfile = () => {
    const [posts, setPosts] = useState([])
    const [userDetails, setUserDetails] = useState({
        'creator': null
    })

    const navigate = useNavigate();

    //detect scroll to load more posts
    
    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled to the bottom
            console.log("handle scroll");

            const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

            if (isAtBottom) {
                //console.log('at bottom!');

                //fetch next n posts

            }
        };

        const fetchData = async () => {
            const token = localStorage.getItem('token');
            console.log("fetch data");
            if (token) {
                try {
                    
                    // const posts: any = await axios.post('/api/post/getUserPosts', {id: uid});
                    // setPosts(posts.data);
                    
                    const response: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
                    console.log("yuh");
                    const user: any = response.data;
                    setUserDetails(response.data);
                    
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
        // Attach the scroll event listener when the component mounts
        window.addEventListener('scroll', handleScroll);
        fetchData();
        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

        
    }, []);






    return (
        <div >
            <p>user profile</p>

            <p>user details</p>
            

        </div>

    )

}

export default UserProfile