import React, { useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { useNavigate } from 'react-router-dom'
import '../components/registerstyles.css'
import '../components/commonstyles.css'


const RegisterScreen = () => {

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const navigate = useNavigate()


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
          <h1 className = 'leftText1'>
            CookChad
          </h1>
          <h1 className = 'leftText2'>
            Free to Register!
          </h1>
          <h1 className = 'leftText2'>
            [insert image]
          </h1>
        </div>
        <div className = "registerRight">
          <div className = "registerBox">
            <div className = "innerRegisterBox">
              <h1 className = "heading">Register Below</h1>
              <input type="text" className = "textBox" placeholder="name" onChange={(e) => setName(e.target.value)} />
              <input type="text" className = "textBox" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
              <input type="text" className = "textBox" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className = "registerButton" onClick={(e) => handleSubmit(e)}>Register</button>
            </div>
          </div>
        </div>
      </div>
      <div className = 'footer'>
        Footer including about page, ect.
      </div>
    </div>
  )

 
}

export default RegisterScreen