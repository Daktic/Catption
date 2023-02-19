import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";

const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");

  const logout = () => {
    // Clear user session/token
    localStorage.removeItem("token");
    // Reset State
    setIsAuthenticated(false);
    // Redirect to the login page
    window.location.replace("/");
  };

  useEffect(() => {
    // check if the user has a JWT token
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("userName");
    if (token) {
      setIsAuthenticated(true);
      setUsername(username);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const navbarStyles = {
    cat: {
      color: "#fe9d3f",
      textShadow: "2px 2px 4px rgba(0, 0, 0, 1)",
    },
    loginButton: {
      background: "rgba(77,209,232, 40%)",
      padding: "15px 30px 15px 30px",
    },
    logoutButton: {
      marginBottom: "2%",
      left: "70%",
      transform: "translateX(-50%)",
      width: "20%",
      textAlign: "center",
    },
    outerBox: {
      display: "inline-flex",
      justifyContent: "flex",
      alignItems: "center",
      background: "rgba(0, 0, 0, 0.2)",
      padding: "2%",
      width: "100%",
      height: "3%",
      boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
    },
    tail: { color: "#2f1200", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" },
    tittleBox: {
      display: "flex",
      alignSelf: "center",
      marginLeft: "25%",
    },
  };

  return (
    <div className={"loginStatus"} style={navbarStyles.outerBox}>
      {window.location.pathname === "/" ? "" : <Link to="/">Home</Link>}
      {isAuthenticated && (
        <p>
          You are logged in as <b>{username}</b>
        </p>
      )}

      {isAuthenticated ? (
        <Button
          onClick={logout}
          variant="outlined"
          style={navbarStyles.logoutButton}
        >
          Logout
        </Button>
      ) : (
        <Button
          variant="filled"
          style={navbarStyles.loginButton}
          onClick={() => {
            window.location = "/login";
          }}
        >
          Login
        </Button>
      )}
      <div style={navbarStyles.tittleBox}>
        <h1>
          Welcome to <b style={navbarStyles.cat}>Cat</b>
          <span style={navbarStyles.tail}>ption</span>!
        </h1>
      </div>
    </div>
  );
};

export default NavBar;
