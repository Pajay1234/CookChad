import React, { useEffect, useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'


const DashboardScreen = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('')

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            const user: any = jwtDecode(token)
            setEmail(user.email)
            if (!user) {
                localStorage.removeItem('token')
                navigate('/login')
            }   


        }
    }, [])

   

  const style: React.CSSProperties = {
    backgroundColor: '#ff4f61',
    width: "100vw",
    height: "100vh",
  }

  return (
    <div id="HomeScreen" style={ style }>
      <h1>Dashboard</h1>
      <p>Hey {email}</p>
      
    </div>
  )

 
}

export default DashboardScreen