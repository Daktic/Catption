import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h1>Welcome to <b style={{color:'gold'}}>Cat</b>ption!</h1>
            <Link to="/login">Login</Link>
            <br/> <br />
            <Link to="/photo">View Photos</Link>
        </div>
    );
}

export default HomePage;