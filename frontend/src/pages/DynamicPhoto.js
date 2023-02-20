import { useParams, useCon } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Comments from "../Components/Comment";
import NavBar from "../Components/NavBar";

const DynamicPhoto = () => {
  let { id } = useParams();

  const [image, setImage] = useState({});
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const headers = {
      "Access-Control-Allow-Origin": "https://www.dropbox.com",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    axios
      .get("http://localhost:80/photo/" + id.toString(), { headers })
      .then((response) => {
        setImage(response.data.photo[0]);
        setComments(response.data.comments);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <NavBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          padding: "10%",
        }}
      >
        <img
          src={image.src}
          style={{
            width: "50%",
            padding: 20,
            display: "flex",
            flexShrink: 1,
          }}
        />
        <div className={"commentBox"}>
          <Comments comments={comments} onEnter={setComments} />
        </div>
      </div>
    </div>
  );
};

export default DynamicPhoto;
