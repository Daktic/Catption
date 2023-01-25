import React, { useState, useEffect } from 'react';
import { Link   } from 'react-router-dom';
import axios from 'axios';

function ImageList() {

    const [images, setImages] = useState([]);

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



    return (
        <div style={{
            display:'flex',
            justifyContent:'center',
            flexDirection:'column',
            alignItems:'center'
        }}>
            <h1>Welcome to the Images</h1>
            {images.map((image, index) => (
                <Link to={`/photo/${image.id}`}
                      key={index} >
                    <img src={image.src}
                         alt={image.name}
                         id={image.id}
                         style={{maxWidth: 600, padding: 20}}/></Link>
            ))}
        </div>
    );
}

export default ImageList;