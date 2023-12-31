import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../components/commonstyles.css'
import '../components/postpagestyles.css'
import Taskbar from '../components/Taskbar'

interface User { 
    name: string
    _id: string
}



const PostPage = () => {
    const [post, setPost] = useState<any>({});
    const [user, setUser] = useState<any>({});
    const { postId } = useParams();
    const [recipe, setRecipe] = useState<string>('')
    const [recipeResponse, setRecipeResponse] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [comment, setComment] = useState('')
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const[commentsDisplayed, setCommentsDisplayed] = useState<any>([])
    const [userId, setUserId] = useState('')
    
    // set the new recipe to the adjusted recipe
    const onSubmitAdjustedRecipe = (e: React.ChangeEvent<HTMLSelectElement>) => { 
        e.preventDefault();
        setRecipe(e.target.value)
       
    }

    // When new comment is submitted, do an APi call to the backend to create the comment in the DB, and refetch all the comments
    const onSubmitComment = async (e: React.MouseEvent<HTMLButtonElement>) =>  {
        try {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const userResponse: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
            const response = await axios.patch('/api/post/createComment', { pid: postId, comment: comment, uid: currentUser!._id, name: currentUser!.name})
            const comments = await axios.get(`/api/post/fetchComments/${post._id}`)
            setCommentsDisplayed(comments.data.comments)
        }
        catch (error) {
            console.log(error)
        }
    }   

    // Get the post, user, and comments from the DB
    useEffect(() => {    
        const getData = async () => {
            try {

                const token = localStorage.getItem('token')
                const currentUser = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token })
                setCurrentUser(currentUser.data)
                await setUserId(currentUser.data._id);
                const postResponse = await axios.get(`/api/post/getPost/${postId}`)
                setPost(postResponse.data);
                setRecipeResponse(postResponse.data.recipe)
                const user = await axios.get(`/api/user/getUser/${postResponse?.data.creator}`)
                setUser(user.data)
                const comments = await axios.get(`/api/post/fetchComments/${postResponse?.data._id}`)
                setCommentsDisplayed(comments.data.comments)
               
            }
            catch (error) {
                console.log(error)
            }
        }
        
        getData();
        
        }, [])
        
        // When the recipe is changed, do an API call to the backend to get the new recipe
        useEffect( () => {const retrieveRecipe = async () => {
            if (recipe != '' && recipe != 'regular') {
                setIsLoading(true)
                setRecipeResponse("Chef Chun Chan is loading your recipe. Please wait.")
                const response = await axios.get('/api/post/getRecipe', {params: { value: recipe, caption: post?.caption }})
                setRecipeResponse(response.data.result)
                setIsLoading(false)
            }
            else {
                setRecipeResponse(post?.recipe)
            }
        } 
        retrieveRecipe(); }, [recipe])
    
  return (
    <div><Taskbar userID={userId} /><div className = "pageContainer">
        <div className = "postPageContainer">
            <div className = "postPageLeft">
                <div className = "postContainer2">
                    {/* Display the post image, user ID, and caption.*/ }
                    <img className = "imgContainer" src={post?.content} />
                    <p> <strong><Link to={`/user-profile/${user._id}`}>{user?.name}</Link></strong> : {post?.caption} </p>
                </div>
            </div>
            <div className = "postPageRight">
                <div className = "recipeBox">
                    <p className = "recipe"> {recipeResponse} </p>
                </div>  
                {/* Display adjust recipe label and a list of dropdown options */}
                <div className = "adjustRecipeMenu">
                    <label className="adjustRecipeLabel">Adjust Recipe: </label>
                    {/* Display adjust recipe dropdown. Disable if a recipe is loading. */}
                    <select disabled={isLoading} name="Adjust Recipe" className="adjustRecipeDropdown" onChange={(e) => onSubmitAdjustedRecipe(e)}>
                        <option value="regular">Default</option>
                        <option value="reduced-fat">Reduced fat</option>
                        <option value="gluten-free">Gluten-free</option>
                        <option value="vegan">Vegan</option>
                    </select>
                </div>
            </div>
            {/* Display all comments on the far right with the name and the corresponding comment. */}
            <div className = "postPageFarRight">
                <div className = "commentDisplayBox">
                    {commentsDisplayed.map((comment: any, index: number) => (
                     <p key={index}><strong>{comment.name}</strong> - {comment.comment}</p>
                    ))}
                </div>  
                <textarea className = "commentBox" placeholder = "Add a comment..." onChange={(e) => setComment(e.target.value)}></textarea>
                <button className = "commentButton" onClick={onSubmitComment}>Comment</button>
            </div>
        </div>
    </div></div>
  )
}

export default PostPage