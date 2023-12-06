import React, { useState, useEffect } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useNavigate, Link } from 'react-router-dom'
import '../components/loginstyles.css'
import '../components/commonstyles.css'


const LoginScreen = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ wrongCredentialBool, setWrongCredentialBool ] = useState(false)

  const navigate = useNavigate();

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const user = {
      email: email, 
      password: password
    };

    try { 
      const response = await axios.post('/api/user/getUserTokenByLogin', user);
      if (response.data) {
        localStorage.setItem('token', response.data)
        navigate('/dashboard')
      }
    }
    catch (error) {
      setWrongCredentialBool(true);
      console.log(error);
    }
  }

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
   }, [] )

  return (
    <div className = 'pageContainer'>
      <div className = 'loginContainer'>
        <div className = 'loginLeft'>
          <h1 className = 'leftText1'>
            CookChad
          </h1>
          <h1 className = 'leftText2'>
            Join the Foodment.
          </h1>
          <h1 className = 'leftText2'>
            [insert image]
          </h1>
        </div>
        <div className = 'loginRight'>
          <div className = 'loginBox'>
            <div className = 'innerLoginBox'>
              <h1 className = "heading">What are you waiting for?</h1>
              <input type="text" className = "textBox" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className = "textBox" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              <p className = "heading2"> Don't have an account? <a href ="/register" className = "hyperlinkColor" >Register now</a></p>
              <button type="submit" className = "loginButton" onClick={(e) => handleSubmit(e)}>Log In</button>
              {wrongCredentialBool === true ? (<p className = "heading3">Email or password is wrong!</p>) : (<p></p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

 
}

export default LoginScreen