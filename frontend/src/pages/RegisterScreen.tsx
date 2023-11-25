import React, { useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'


const RegisterScreen = () => {

  const [ name, setName ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')

  const style: React.CSSProperties = {
    backgroundColor: '#ff4f61',
    width: "100vw",
    height: "100vh",
  }


  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const user = {
      name: name,
      email: email, 
      password: password
    };

    try { 
      const response = await axios.post('/api/user/createUser', user);
      console.log(response);
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div id="HomeScreen" style={ style }>
      <h1>Register</h1>
      <input type="text" placeholder="name" onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="text" placeholder="password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit" onClick={(e) => handleSubmit(e)}>Submit</button>
    </div>
  )

 
}

export default RegisterScreen