import { Box, Card, Typography, Button, TextField } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const commentStyles = {
  commentsAndUpvotes: {
    display: "flex",
    alignItems: "center",
    padding: "3%",
  },
  upvoteNum: {
    display: "block",
    color: "darkGreen",
    marginRight: "8px",
  },
  commentText: {
    display: "block",
    textAlign: "center",
  },
  username: {
    marginLeft: "4px",
  },
  outerCommentBox: {
    display: "flex",
    mx: "2px",
    transform: "scale(0.8)",
  },
  innerVoteBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "22px",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  upvote: {
    marginBottom: "10px",
    "&:hover": {
      cursor: "pointer",
      color: "green",
    },
  },
  downvote: {
    marginBottom: "10px",
    "&:hover": {
      cursor: "pointer",
      color: "red",
    },
  },
};

const Comments = (props) => {
  let { id } = useParams();

  const [showCommentForm, setShowCommentForm] = useState(true);
  const [commentText, setCommentText] = useState("");

  const textFieldRef = useRef(null);

  const submitComment = async (text) => {
    const userId = localStorage.getItem("userID");
    const urlPost =
      "http://localhost:80/photo/" +
      id.toString() +
      `?userId=${userId}&action=createComment`;
    const data = { comment: commentText };
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    };
    try {
      const response = await axios.post(urlPost, data, config);
    } catch (error) {
      if (error.response.status === 401) {
        alert(error.response.data.message);
        window.location.href = "/login";
      } else {
        console.error(error);
      }
    }
    setShowCommentForm(!showCommentForm);
  };

  const handleAddComment = () => {
    if (
      showCommentForm === false &&
      commentText.length > 0 &&
      commentText.length < 255
    ) {
      const ref = textFieldRef.current;
      submitComment(ref);
    }
    setShowCommentForm(!showCommentForm);
  };
  const handleChange = (event) => {
    setCommentText(event.target.value.toString());
  };

  const handleKeyDown = async (event) => {
    if (
      showCommentForm === false &&
      commentText.length > 0 &&
      commentText.length < 255 &&
      event.key === "enter"
    ) {
      submitComment(event);
    }
  };

  const handleClick = (currentTarget) => {
    //console.log(currentTarget.id)
    axios
      .post(
        "http://localhost:80/photo/" + id.toString() + `?action=deleteComment`,
        { commentId: currentTarget.id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer JWT_ACCESS_TOKEN",
          },
        }
      )
      .then((response) => {
        // let updatedComments = [...props.comments];
        // updatedComments.push({commentText: commentText});
        // props.onEnter(updatedComments);
        // setCommentText('')
        //console.log(response)
      });
  };
  const handleVote = async (e) => {
    const userId = localStorage.getItem("userID");

    //get the parent's parent id to identify which comment to update
    const commentId = e.currentTarget.parentNode.parentNode.getAttribute("id");
    const arrowDirection = e.currentTarget.getAttribute("arrowdirection");

    // Axios request to the backend server
    const urlPost =
      "http://localhost:80/photo/" +
      id.toString() +
      `?userId=${userId}&action=${arrowDirection}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    };
    const data = { commentId: commentId };
    try {
      const response = await axios.post(urlPost, data, config);
    } catch (error) {
      if (error.response.status === 401) {
        alert(error.response.data.message);
        window.location.href = "/login";
      } else {
        console.error(error);
      }
    }
  };
  const timeAgo = (tz) => {
    // Create a new Date object from the tz string
    const date = new Date(tz);

    // Calculate the difference in milliseconds
    const difference = Date.now() - date.getTime();

    // Calculate the difference in seconds, minutes, hours, and days
    const seconds = difference / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;

    // Return the difference as a string in the format "days hours minutes seconds"
    let timeStruct = {};

    if (days >= 1) {
      timeStruct.type = "Day";
      timeStruct.time = Math.floor(days);
    } else if (hours >= 1) {
      timeStruct.type = "Hour";
      timeStruct.time = Math.floor(hours % 24);
    } else if (minutes >= 1) {
      timeStruct.type = "Minute";
      timeStruct.time = Math.floor(minutes % 60);
    } else if (seconds) {
      timeStruct.type = "Second";
      timeStruct.time = Math.floor(seconds % 60);
    }

    return timeStruct;
  };

  return (
    <div>
      {props.comments.map((comment, index) => (
        <Box sx={commentStyles.outerCommentBox} key={index} id={comment.id}>
          <Card sx={commentStyles.innerVoteBox}>
            <ArrowUpwardIcon
              arrowdirection={"upvote"}
              sx={commentStyles.upvote}
              onClick={handleVote}
            />
            <ArrowDownwardIcon
              arrowdirection={"downvote"}
              sx={commentStyles.downvote}
              onClick={handleVote}
            />
          </Card>
          <Card sx={{ transform: "scale(1)" }} onClick={handleClick} id={index}>
            <div>
              <Typography
                variant="body2"
                sx={{
                  display: "inline-block",
                  marginRight: "20%",
                  marginLeft: "5%",
                }}
              >
                Posted by
                <b style={commentStyles.username}>{comment.username}</b>
              </Typography>
              <Typography
                sx={{ fontSize: 14, display: "inline-block", marginLeft: "5%" }}
                color="text.secondary"
                gutterBottom
              >
                {timeAgo(comment.createdAt).time}{" "}
                {timeAgo(comment.createdAt).type}
                {timeAgo(comment.createdAt).time > 1 ? "s" : ""} ago
              </Typography>
            </div>
            <div style={commentStyles.commentsAndUpvotes}>
              <Typography
                variant="h5"
                component="div"
                margin={"1%"}
                style={commentStyles.upvoteNum}
              >
                {comment.upVotes}
              </Typography>
              <Typography
                variant="h5"
                component="div"
                margin={"1%"}
                style={commentStyles.commentText}
              >
                {comment.commentText}
              </Typography>
            </div>
          </Card>
        </Box>
      ))}

      <div hidden={showCommentForm}>
        <Box sx={{ marginTop: 3 }}>
          <TextField
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            value={commentText}
            ref={textFieldRef}
          >
            Comment
          </TextField>
        </Box>
      </div>
      <Button
        variant="contained"
        endIcon={<AddCommentIcon />}
        onClick={handleAddComment}
        sx={{ marginTop: 1, alignSelf: "center" }}
      >
        Add Comment
      </Button>
    </div>
  );
};

export default Comments;
