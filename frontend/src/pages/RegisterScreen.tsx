import React, { useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom'
import '../components/registerstyles.css'
import '../components/commonstyles.css'
import Logo from '../assets/icons/logo.png'


const RegisterScreen = () => {

  // All states for the name, email, and password. Set when the user inputs somethign in the input boxes.
  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const navigate = useNavigate()


  // Do an API call to the backend to create a user. If successful, navigate to the login page.
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const user = {
      name: name,
      email: email, 
      password: password
    };

    try { 
      const response = await axios.post('/api/user/createUser', user);
      navigate('/')
      console.log(response);
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className = "pageContainer">
      <div className = "registerContainer">
        <div className = "registerLeft">
          {/* Display CookChad logo, Free to Register! slogan and the corresponding logo */} 
          <h1 className = 'leftText1'>
            CookChad
          </h1>
          <h1 className = 'leftText2'>
            Free to Register!
          </h1>
          <h1 className = 'leftText2'>
            <img src={Logo} className ="w-40.5 h-40.5"/>
          </h1>
        </div>
        {/* Display register below text, input boxes to register, and a submit button to register an acocunt */}
        <div className = "registerRight">
          <div className = "registerBox">
            <div className = "innerRegisterBox">
              <h1 className = "heading">Register Below</h1>
              <input type="text" className = "textBox" placeholder="name" onChange={(e) => setName(e.target.value)} />
              <input type="text" className = "textBox" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
              <input type="password" className = "textBox" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className = "registerButton" onClick={(e) => handleSubmit(e)}>Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

 
}

export default RegisterScreen