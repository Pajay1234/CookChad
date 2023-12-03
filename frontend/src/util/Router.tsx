import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RegisterScreen from '../pages/RegisterScreen';
import LoginScreen from '../pages/LoginScreen';
import DashboardScreen from '../pages/Dashboard';
import CreatePost from '../pages/CreatePost';
import PostPage from '../pages/PostPage';
import UserProfile from '../pages/UserProfile';

//router props type
interface routerProps {

}

//router state type
interface routerState {

}

class Router extends React.Component<routerProps, routerState> {
   
    state: routerState;
    constructor(props: routerProps) {
        super(props);

        this.state = {

        };

        
    }   

    

    render() {
       
        return (
            <div className="App">
                <BrowserRouter>
                    <Routes>
                        {/* 
                        sample code for adding route
                        <Route path="/mycomponent/:id" component={MyComponent} /> 
                        */}
                        <Route path="/post/:postId" element={<PostPage />} />
                        <Route path="/register" element={<RegisterScreen />} />  
                        <Route path="/" element={<LoginScreen />} />  
                        <Route path="/dashboard" element={<DashboardScreen />} />  
                        <Route path="/create-post" element={<CreatePost />} />
                        <Route path="/user-profile" element={<UserProfile />} />
                    </Routes>
                </BrowserRouter>
            </div>
        );
    }
}


export default Router;