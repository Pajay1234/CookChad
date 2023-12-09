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
    const [likedPosts, setLikedPosts] = useState<any>([])
    const [followers, setFollowers] = useState<any>([])
    const [following, setFollowing] = useState<any>([])

    const [userDetails, setUserDetails] = useState<any>({})
    const { userID } = useParams(); //id of current user profile
    const [currUserID, setCurrUserID] = useState("");
    const [isSelf, setIsSelf] = useState(false)
    const [isMyFriend, setIsMyFriend] = useState<Boolean>(false)
    const navigate = useNavigate();
    const [toggle, setToggle] = useState<String>('Posts');

    const handleToggle = (e: any, section: String) => {
        e.preventDefault();
        setToggle(section);
    }

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
        const likedPostArray: any = [];
        const followersArray: any = [];
        const followingArray: any = [];

        setIsMyFriend(userDetails.followers?.includes(currUserID));
        userDetails.likedPosts?.forEach(async (postID: any) => {
            try {
                const response: any = await axios.get(`/api/post/getPost/${postID}`);
                likedPostArray.push(response.data);
            } catch (error) {
                console.log(error);
            }
        })

        setLikedPosts(likedPostArray);

        userDetails.followers?.forEach(async (followerID: any) => {
            try {
                const response: any = await axios.get(`/api/user/getUser/${followerID}`);
                followersArray.push(response.data);
            } catch (error) {
                console.log(error);
            }
        })

        setFollowers(followersArray);

        userDetails.following?.forEach(async (followingID: any) => {
            try {
                const response: any = await axios.get(`/api/user/getUser/${followingID}`);
                followingArray.push(response.data);
            } catch (error) {
                console.log(error);
            }
        })

        setFollowing(followingArray);
    }, [userDetails])

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
        <div className = ""><div className='flex flex-col gap-2'>
            <Taskbar userID={currUserID} />
            <div className="flex flex-col py-2 px-16 justify-center gap-2">
                <div className="flex gap-16">
                    <p className="text-2xl font-bold">{userDetails.name}</p>
                    {/* Display the follow or following button depending whether the user has been followed or not. The button will not appear for anyone trying to follow themself. */}
                    <div className="flex gap-8">
                        {isSelf ? null :
                            (isMyFriend ? (
                                <div className="bg-emerald-300 py-2 px-3 rounded-sm flex gap-2 justify-center items-center hover:bg-emerald-400 font-semibold" onClick={handleAddFriend}>
                                    <p>Following</p>
                                    <img src={AddedFriend} alt="add friend" className='w-5 h-5' />
                                </div>
                            ) : (
                                <div className=" bg-cyan-300 py-2 px-3 rounded-sm flex gap-2 justify-center items-center hover:bg-cyan-400 font-semibold" onClick={handleAddFriend}>
                                    <p>Follow</p>
                                    <img src={AddFriend} alt="add friend" className='w-5 h-5' />
                                </div>
                            ))
                        }
                        <p className="bg-gray-200 py-2 px-3 rounded-sm hover:bg-gray-300 font-semibold" onClick={(e) => handleToggle(e, 'Posts')}>Posts</p>
                        <p className="bg-gray-200 py-2 px-3 rounded-sm hover:bg-gray-300 font-semibold" onClick={(e) => handleToggle(e, 'Liked Posts')}>Liked Posts</p>
                        <p className="bg-gray-200 py-2 px-3 rounded-sm hover:bg-gray-300 font-semibold" onClick={(e) => handleToggle(e, 'Followers')}>Followers</p>
                        <p className="bg-gray-200 py-2 px-3 rounded-sm hover:bg-gray-300 font-semibold" onClick={(e) => handleToggle(e, 'Following')}>Following</p>

                    </div>

                </div>
            </div>

            {toggle === 'Posts' && posts != null ? (
                <div className="dashContainer">
                    {/* DDisplay the user's posts unless there is no posts*/}
                    {posts.length > 0 ? (
                        posts.map((post: any) => (
                            <Post
                                key={post._id}
                                postId={post._id}
                                caption={post.caption}
                                content={post.content}
                                likes={post.likes}
                                comments={post.comments}
                                creatorId={post.creator}
                                userId={currUserID}
                            />))
                    ) : (
                        <div className="">
                            <p>{userDetails.name} has not posted anything!</p>
                        </div>
                    )}
                </div>
            ) : null}
            {/* If the liked post is toggled, display the liked post's content of the user; otherwise, display that there are no liked posts */}
            {toggle === 'Liked Posts' && likedPosts != null ? (
                <div className="dashContainer">
                    {likedPosts.length > 0 ? (
                        likedPosts.map((post: any) => (
                            <Post
                                key={post._id}
                                postId={post._id}
                                caption={post.caption}
                                content={post.content}
                                likes={post.likes}
                                comments={post.comments}
                                creatorId={post.creator}
                                userId={currUserID}
                            />))
                    ) : (
                        <div className="">
                            <p>{userDetails.name} has not liked any posts!</p>
                        </div>
                    )}
                </div>
            ) : null}
              {/* If the following is toggled, display all the user's followers along with a link to their profile; otherwise, display there are no followers */}
            {toggle === 'Followers' && followers != null ? (
                <div className="bg-[#F09449] min-h-[90.5vh] p-16">
                    {followers.length > 0 ? (
                        followers.map((follower: any) => (
                            <div className="flex gap-2 items-center">
                                <Link to={`/user-profile/${follower._id}`}><p className="font-semibold">{follower.name}</p></Link>
                                <Link to={`/user-profile/${follower._id}`}><p className="bg-gray-200 py-2 px-3 rounded-sm hover:bg-gray-300 font-semibold">Profile</p></Link>
                            </div>
                        ))
                    ) : (
                        <div className="">
                            <p>{userDetails.name} has no followers!</p>
                        </div>
                    )}
                </div>
            ) : null}
            {/* If the following is toggled, display all the user's followings along with a link to their profile; otherwise, display the user has no followings */}
            {toggle === 'Following' && following != null ? (
                <div className="bg-[#F09449] min-h-[90.5vh] p-16">
                    {following.length > 0 ? (
                        following.map((follow: any) => (
                            <div className="flex gap-2 items-center" key={follow._id}>
                                <Link to={`/user-profile/${follow._id}`}>
                                    <p className="font-semibold">{follow.name}</p>
                                </Link>
                                <Link to={`/user-profile/${follow._id}`}><p className="bg-gray-200 py-2 px-3 rounded-sm hover:bg-gray-300 font-semibold">Profile</p></Link>
                            </div>
                        ))
                    ) : (
                        <div className="">
                            <p>{userDetails.name} has not followed anyone!</p>
                        </div>
                    )}
                </div>
            ) : null}



        </div></div>

    )

}

export default UserProfile