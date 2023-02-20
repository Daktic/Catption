import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Card, Typography, Button, TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import NavBar from "../Components/NavBar";

const outerDiv = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  height: "100vh",
};

const loginFormStyle = {
  outerBox: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    margin: "30px",
  },
  registration: {
    // background: "red",
    border: "2px solid red",
    borderRadius: "25px",
    padding: "15px",
  },
};

const disclaimerStyle = {
  card: {
    width: "30%",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  typography: {},
};

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [registerToggle, setRegisterToggle] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState({
    bool: false,
    style: {
      border: "2px solid red",
    },
  });

  const handleMouseOver = (e) => {
    e.target.style.color = "blue";
    e.target.style.cursor = "pointer";
  };
  const handleMouseOut = (e) => {
    e.target.style.color = "black";
    e.target.style.cursor = "default";
  };
  const handleRegisterToggle = () => {
    setRegisterToggle(!registerToggle);
  };
  const handleRegisterClick = async () => {
    setError("");

    if (!username || !password) {
      setError("Please enter a username and password");
      return;
    } else if (passwordsMatch.bool === false) {
      setError("Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://localhost:80/login?register=true", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else if (data.success) {
        setSuccess(true);
        setError("User Created! \n Please login");
        handleRegisterToggle();
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(error);
      setError(error);
    }
  };

  const handleSubmit = (e) => {
    setError("");
    e.preventDefault();
    // validate form fields
    if (!username || !password) {
      setError("Please enter a username and password");
      return;
    }
    // send login request to server
    fetch("http://localhost:80/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.success.token); // stores jwt in local storage
          localStorage.setItem("userID", data.success.user.id);
          localStorage.setItem("userName", data.success.user.username);
          window.location.href = "/";
        } else if (data.error) {
          setError(data.error);
        } else {
          console.log("fail");
          console.log(data);
          setError(data.message);
        }
      })
      .catch((err) => {
        setError("An error occurred. Please try again later.");
      });
  };

  useEffect(() => {
    // check if the user has a JWT token

    if (error) {
      setOpen(true);
    }
  }, [error]);
  const handleClose = () => {
    setOpen(false);
    setError("");
  };

  useEffect(() => {
    // check if the user has a JWT token
    const token = localStorage.getItem("token");
    if (token) {
      setHasToken(true);
    } else {
      setHasToken(false);
    }
  }, []);

  useEffect(() => {
    // check if the passwords match
    if (password === confirmPassword) {
      setPasswordsMatch({
        bool: true,
        style: {
          border: "2px solid green",
        },
      });
    } else {
      setPasswordsMatch({
        bool: false,
        style: {
          border: "2px solid red",
        },
      });
    }
  }, [password, confirmPassword]);

  return (
    <div style={outerDiv}>
      {error && (
        <Dialog
          onClose={handleClose}
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {success ? "Success:" : "Error:"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {error}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>close</Button>
          </DialogActions>
        </Dialog>
      )}

      <form onSubmit={handleSubmit} style={loginFormStyle.outerBox}>
        <label>
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
        <div id={"confirmPassword"} hidden={!registerToggle}>
          <label>
            Confirm Password:
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={passwordsMatch.style}
            />
          </label>
          <br />
        </div>

        <div id={"loginButton"} hidden={registerToggle}>
          <Button type="submit" variant={"filled"} sx={{ background: "gray" }}>
            Login
          </Button>
        </div>
        <a
          onClick={handleRegisterToggle}
          onMouseOver={handleMouseOver}
          onMouseLeave={handleMouseOut}
        >
          <p style={loginFormStyle.registration}>
            {registerToggle ? "Already registered?" : "Not registered?"}
          </p>
        </a>

        <div hidden={!registerToggle}>
          <Button
            variant={"filled"}
            onClick={handleRegisterClick}
            sx={{ background: "green", marginLeft: 5 }}
          >
            Register
          </Button>
        </div>
      </form>
      <Card style={disclaimerStyle.card}>
        <Box>
          <Typography>
            Hello! Please note, this is a website I put together in my free
            time. please don't reuse passwords from other sites, as I cannot
            guarentee the sites security.
          </Typography>
        </Box>
      </Card>
    </div>
  );
};

export default LoginPage;
