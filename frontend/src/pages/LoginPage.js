import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [open, setOpen] = React.useState(false);
    const [hasToken, setHasToken] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        // check if the user has a JWT token
        const token = localStorage.getItem('token');
        if (token) {
            setHasToken(true);
        } else {
            setHasToken(false);
        }
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();
        // validate form fields
        if (!username || !password) {
            setError('Please enter a username and password');
            return;
        }
        // send login request to server
        fetch('http://localhost:80/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    localStorage.setItem('token', data.success.token); // stores jwt in local storage
                    localStorage.setItem('userID', data.success.user.id);
                    localStorage.setItem('userName', data.success.user.username);
                    window.location.href = '/';
                } else if (data.error) {
                    handleClickOpen();
                    setError(data.error);
                }
                else {
                    console.log('fail')
                    console.log(data)
                    setError(data.message);

                }
            })
            .catch((err) => {
                setError('An error occurred. Please try again later.');
            });
    };

    return (
        <div style={{padding: '20%'}}>

            {error && <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Error:"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {error}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>close</Button>
                </DialogActions>
            </Dialog>}

            <form onSubmit={handleSubmit}>
                <label >
                    Username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <br />
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <br />
                {error && <p>{error}</p>}
                <button type="submit">Login</button>
            </form>
    </div>

    );
};

export default LoginPage;
