import {Link} from "react-router-dom";
import React, {useEffect, useState} from "react";


const NavBar = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        // check if the user has a JWT token
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('userName');
        if (token) {
            setIsAuthenticated(true);
            setUsername(username)
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <div className={"loginStatus"} sx={{
            display: 'inline-block',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'absolute',
            top: '10px',
            right: '10px',
            background:'red'
        }}>
            {window.location.pathname === '/' ? '' : <Link to="/">Home</Link> }
            {isAuthenticated ? <p>You are logged in as <b>{username}</b></p> : <Link to="/login">Login</Link>}
        </div>
    )
}

export default NavBar;