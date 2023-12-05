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
    const [recipe, setRecipe] = useState<string>('')
    const [recipeResponse, setRecipeResponse] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)
    

    const onSubmitAdjustedRecipe = (e: React.ChangeEvent<HTMLSelectElement>) => { 
        e.preventDefault();
        setRecipe(e.target.value)
       
    }

    useEffect(() => {    
        const getData = async () => {
            try {
                const post = await axios.get(`/api/post/getPost/${postId}`)
                setPost(post.data);
                const user = await axios.get(`/api/user/getUser/${post?.data.creator}`)
                setUser(user.data)
                setRecipeResponse(post.data.recipe)
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

            </div>
        </div>
    </div>
  )
}

export default PostPage