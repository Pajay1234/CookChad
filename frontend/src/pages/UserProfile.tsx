import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import Post from '../components/Post'
import AddFriend from '../assets/icons/addfriend.png'
import Taskbar from '../components/Taskbar';
import AddedFriend from '../assets/icons/added.png'
import '../components/commonstyles.css'



const UserProfile = () => {
    const [posts, setPosts] = useState<any>([])
    const [userDetails, setUserDetails] = useState<any>({})
    const { userID } = useParams(); //id of current user profile
    const [currUserID, setCurrUserID] = useState("");
    const [isSelf, setIsSelf] = useState(false)
    const [isMyFriend, setIsMyFriend] = useState<Boolean>(false)

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
                    console.log(currUser.data._id + "       " + userID);
                    await setCurrUserID(currUser.data._id);
                    if (currUser.data._id === userID) {
                        console.log("my profile");
                        await setIsSelf(true);
                    }
                    const response: any = await axios.get(`/api/user/getUser/${userID}`);
                    console.log(response.data);
                    await setUserDetails(response.data);
                    const posts: any = await axios.post('/api/user/getUserPosts', { uid: userID });
                    console.log(posts)
                    await setPosts(posts.data);


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

    useEffect(() => {
        setIsMyFriend(userDetails.followers?.includes(currUserID));
    }
        , [userDetails])

    const handleAddFriend = async () => {
        try {
            console.log("Adding friend...");
            const response = await axios.patch(`/api/user/addFriend/${currUserID}/${userID}`);
            await setIsMyFriend(!isMyFriend);
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className = "pageContainer">
            <Taskbar userID={currUserID} />
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
                    <div className='flex gap-2 justify-center items-center hover:underline hover:underline-offset-4' onClick={handleAddFriend}>

                        {isMyFriend ? (
                            <div>
                                <p>Unfollow</p>
                                <img src={AddedFriend} alt="add friend" className='w-5 h-5' />
                            </div>
                        ) : (
                            <div>
                                <p>Follow</p>
                                <img src={AddFriend} alt="add friend" className='w-5 h-5' />
                            </div>
                        )}

                    </div>
                )
            }

            <div className="dashContainer">


                {posts.map((post: any) => (<Post key={post._id} postId={post._id} caption={post.caption} content={post.content} likes={post.likes} comments={post.comments} creatorId={post.creator} userId={currUserID} />)

                )}
            </div>


        </div>

    )

}

export default UserProfile