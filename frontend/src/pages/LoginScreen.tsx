import React, { useState, useEffect } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useNavigate, Link } from 'react-router-dom'
import '../components/loginstyles.css'
import '../components/commonstyles.css'
import Logo from '../assets/icons/logo.png'


const LoginScreen = () => {

  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ wrongCredentialBool, setWrongCredentialBool ] = useState(false)

  const navigate = useNavigate();

  // When the user logins, set the token inside local storage and navigate to the dashboard. If the user details are wrong, set the wrong credential boolean to true 
  // and display it to the user.
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

  // If token exists, navigate to the dashboard.
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard')
    }
   }, [] )

  return (
    <div className = 'pageContainer'>
      <div className = 'loginContainer'>
        <div className = 'loginLeft'>
          {/* Display the name of our product and our slogan */}
          <h1 className = 'leftText1'>
            CookChad
          </h1>
          <h1 className = 'leftText2'>
            Join the Foodment.
          </h1>
          { /* Display an image of the logo? */ }
          <h1 className = 'leftText2'>
            <img src={Logo} className ="w-40.5 h-40.5"/>
          </h1>
        </div>
        <div className = 'loginRight'>
          <div className = 'loginBox'>
            <div className = 'innerLoginBox'>
              {/* Display all buttons and input options including the 
              email, password, the register button in the case the user does not have an account, and the login button.
              */}
              <h1 className = "heading">What are you waiting for?</h1>
              <input type="text" className = "textBox" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className = "textBox" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
              <p className = "heading2"> Don't have an account? <a href ="/register" className = "hyperlinkColor" >Register now</a></p>
              <button type="submit" className = "loginButton" onClick={(e) => handleSubmit(e)}>Log In</button>
              {/* If credentials are wrong display that the Email and Password is wrong.*/}
              {wrongCredentialBool === true ? (<p className = "heading3">Email or password is wrong!</p>) : (<p></p>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

 
}

export default LoginScreen