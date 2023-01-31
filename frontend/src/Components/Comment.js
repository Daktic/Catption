import {Box, Card, Typography, Button, TextField} from '@mui/material';
import AddCommentIcon from '@mui/icons-material/AddComment';
import {useEffect, useState} from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
const Comments = (props) => {
    let { id } = useParams();

    const [showCommentForm, setShowCommentForm] = useState(true);
    const [commentText, setCommentText] = useState('');

    const handleAddComment = () => {
        setShowCommentForm(!showCommentForm)
    }
    const handleChange = (event) => {
        setCommentText(event.target.value.toString())
    }

    const handleKeyDown = (event) => {
        const userId = 1;
        if (event.key === 'Enter' && commentText.length > 0 < 255) {
            axios.post('http://localhost:80/photo/' + id.toString() + `?userId=${userId}&action=createComment`,
                {comment: commentText},
                {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer JWT_ACCESS_TOKEN'}})
                .then((response) => {
                    let updatedComments = [...props.comments];
                    updatedComments.push({commentText: commentText});
                    props.onEnter(updatedComments);
                    setCommentText('')
                })

            setShowCommentForm(!showCommentForm)
        }
        }

        const handleClick = ({currentTarget}) => {
            console.log(currentTarget.id)
            axios.post('http://localhost:80/photo/' + id.toString() + `?action=deleteComment`,
                {commentId: currentTarget.id},
                {headers: {'Content-Type': 'application/json', 'Authorization': 'Bearer JWT_ACCESS_TOKEN'}})
                .then((response) => {
                    // let updatedComments = [...props.comments];
                    // updatedComments.push({commentText: commentText});
                    // props.onEnter(updatedComments);
                    // setCommentText('')
                    //console.log(response)
                })
        }


    return (
        <div>
            {props.comments.map((comment, index) => (
                <Box
                    sx={{ display: 'flex-wrap', mx: '2px', transform: 'scale(0.8)' }}
                    key={index}
                >
                    <Card
                        sx={{ transform: 'scale(1)' }}
                        onClick={handleClick}
                        id={index}
                    >
                        <div>
                            <Typography variant="body2" sx={{display: 'inline-block', marginRight:'20%', marginLeft:'5%'}}>
                                UserName
                            </Typography>
                            <Typography sx={{ fontSize: 14, display: 'inline-block'  }} color="text.secondary" gutterBottom>
                                posted x hours ago
                            </Typography>
                        </div>


                        <Typography variant="h5" component="div" margin={'1%'}>
                            {comment.commentText}
                        </Typography>
                    </Card>

                </Box>
            ))}
            <Button variant="contained" endIcon={<AddCommentIcon />}
            onClick={handleAddComment}
                    sx={{marginTop:1, alignSelf:'center'}}>
                Add Comment
            </Button>
            <div hidden={showCommentForm}>
                <Box sx={{marginTop:3}}>
                    <TextField
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    value={commentText}
                    >
                        Comment
                    </TextField>
                </Box>
            </div>
        </div>
    )
}

export default Comments;