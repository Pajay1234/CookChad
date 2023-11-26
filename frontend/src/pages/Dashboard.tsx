import React, { useEffect, useState } from 'react'
import axios from 'axios'
import bcrypt from 'bcryptjs'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'


const DashboardScreen = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('')

    useEffect(() => {
      const fetchData = async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const response: any = await axios.post('/api/user/getUserByJWTToken', { JWTToken: token });
            setName(response.data.name);
          } catch (error) {
            localStorage.removeItem('token');
            navigate('/');
          }
        }
        else {
          navigate('/')
        }
      };

      fetchData();
    }, []);

   

  const style: React.CSSProperties = {
    backgroundColor: '#ff4f61',
    width: "100vw",
    height: "100vh",
  }

  return (
    <div id="HomeScreen" style={ style }>
      <h1>Dashboard</h1>
      <p>Hey {name}</p>
      
    </div>
  )

 
}

export default DashboardScreen