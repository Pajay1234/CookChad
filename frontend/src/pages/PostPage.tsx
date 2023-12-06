import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../components/commonstyles.css'
import '../components/postpagestyles.css'
import Taskbar from '../components/Taskbar'

interface User { 
    name: string
    _id: string
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
    const [recipe, setRecipe] = useState<string>('')
    const [recipeResponse, setRecipeResponse] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [comment, setComment] = useState('')
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const[commentsDisplayed, setCommentsDisplayed] = useState<any>([])
    

    const onSubmitAdjustedRecipe = (e: React.ChangeEvent<HTMLSelectElement>) => { 
        e.preventDefault();
        setRecipe(e.target.value)
       
    }

    const onSubmitComment = async (e: React.MouseEvent<HTMLButtonElement>) =>  {
        try {
            e.preventDefault();
            const response = await axios.patch('/api/post/createComment', { pid: postId, comment: comment, uid: currentUser!._id, name: currentUser!.name})
            const comments = await axios.get(`/api/post/fetchComments/${post._id}`)
            setCommentsDisplayed(comments.data.comments)
        }
        catch (error) {
            console.log(error)
        }
    }   

    useEffect(() => {    
        const getData = async () => {
            try {

                const token = localStorage.getItem('token')
                const currentUser = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token })
                setCurrentUser(currentUser.data)
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
    <div className = "pageContainer">
        <Taskbar />
        <div className = "postPageContainer">
            <div className = "postPageLeft">
                <div className = "postContainer2">
                    <img className = "imgContainer" src={post?.content} />
                    <p> <strong>{user?.name}</strong> : {post?.caption} </p>
                </div>
            </div>
            <div className = "postPageRight">
                <div className = "recipeBox">
                    <p className = "recipe"> {recipeResponse} </p>
                </div>  
                <div className = "adjustRecipeMenu">
                    <label className="adjustRecipeLabel">Adjust Recipe: </label>
                    <select disabled={isLoading} name="Adjust Recipe" className="adjustRecipeDropdown" onChange={(e) => onSubmitAdjustedRecipe(e)}>
                        <option value="regular">Default</option>
                        <option value="reduced-fat">Reduced fat</option>
                        <option value="gluten-free">Gluten-free</option>
                        <option value="vegan">Vegan</option>
                    </select>
                </div>
            </div>
            <div className = "postPageFarRight">
                <div className = "commentDisplayBox">
                    {commentsDisplayed.map((comment: any, index: number) => (
                     <p key={index}><strong>{comment.name}</strong> - {comment.comment}</p>
                    ))}
                </div>  
                <input className = "commentBox" placeholder = "Add a comment..." onChange={(e) => setComment(e.target.value)}></input>
                <button className = "commentButton" onClick={onSubmitComment}>Comment</button>
            </div>
        </div>
    </div>
  )
}

export default PostPage