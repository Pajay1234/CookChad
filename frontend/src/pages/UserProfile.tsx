import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Post from '../components/Post'



const UserProfile = () => {
    const [posts, setPosts] = useState<any>([])
    const [userDetails, setUserDetails] = useState<any>({})
    const { userID } = useParams(); //id of current user profile
    const [isSelf, setIsSelf] = useState(false)

    const navigate = useNavigate();

    //detect scroll to load more posts
    
    useEffect(() => {
        const handleScroll = () => {
            // Check if the user has scrolled to the bottom
            const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight;

            if (isAtBottom) {
                console.log('at bottom!');
                //fetch next n posts

            }
        };

        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const currUser: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
                    //console.log(currUser.data._id + "       " + userID);
                    if (currUser.data._id === userID) {
                        console.log("my profile");
                        await setIsSelf(true);
                    }
                    const response: any = await axios.get(`/api/user/getUser/${userID}`);
                    await setUserDetails(response.data);
                    const posts: any = await axios.post('/api/user/getUserPosts', { uid: userID});
                    await setPosts(posts.data);
                    /*
                    check if user can access friends, log out, edit posts, etc. 
                    check if param user id and userID based on token match
                    */
                } catch (error: any) {
                    console.log(error);
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

            <p>{userDetails.name}</p>
            <p>{userDetails.email}</p>
            
            {
                isSelf ? (
                    <div>
                        <p>friends</p>
                        <p>liked posts</p>
                        <p>delete posts</p>
                        <p>edit posts</p>
                    </div>
                ) : (
                    <p>add friend</p>
                )
            }
            
            <div className = "dashContainer">
        
               
                {posts.map((post: any) => (<Post key={post._id} postId={post._id} caption={post.caption} content={post.content} userId={post.creator}/>)

                )}
            </div>
        

        </div>

    )

}

export default UserProfile