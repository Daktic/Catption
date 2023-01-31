import React, { useState, useEffect } from 'react';
import { Link   } from 'react-router-dom';
import axios from 'axios';
import NavBar from "./NavBar";


function ImageList() {

    const [images, setImages] = useState([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const headers = {
            'Access-Control-Allow-Origin': 'https://www.dropbox.com',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
        };

        axios
            .get('http://localhost:80/photo',
                {headers})
            .then((response) => {
                setImages(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

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
        <div>
            <NavBar />
            <div style={{
                display:'flex',
                justifyContent:'center',
                flexDirection:'column',
                alignItems:'center'
            }}>
                <div>
                    <h1>Welcome to <b style={{color:'gold'}}>Cat</b>ption!</h1>
                    <h3>Please click a photo to view comments</h3>
                    <br/> <br />

                </div>
                {images.map((image, index) => (
                    <Link to={`/photo/${image.id}`}
                          key={index} >
                        <img src={image.src}
                             alt={image.name}
                             id={image.id}
                             style={{maxWidth: 600, padding: 20}}/></Link>
                ))}
            </div>
        </div>
    );



}

export default ImageList;