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
          CookChad!
        </div>
        <div className = 'loginRight'>
          <div className = 'loginBox'>
            <h1>Login Here</h1>
            <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
            <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
            <p>Don't have an account? <Link to="/register">Register here.</Link></p>
            {wrongCredentialBool === true ? (<p>Email or password is wrong.</p>) : (<p></p>)}
            <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
          </div>
        </div>
      </div>
      <div className = 'footer'>
        Footer including about page, ect.
      </div>
    </div>
  )

 
}

export default LoginScreen