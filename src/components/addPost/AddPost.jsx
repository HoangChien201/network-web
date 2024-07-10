import "./addPost.css";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faSmile,
  faTag,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import CurrentUserData from "../../FackApis/CurrentUserData";

export default function AddPost() {
  const [content, setContent] = useState("");
  const [mediaUrls, setMediaUrls] = useState([]);
  const [mediaType, setMediaType] = useState(""); // image hoặc video

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => ({
      url: URL.createObjectURL(file),
      resource_type: file.type.startsWith("image/") ? "image" : "video",
    }));
    setMediaUrls(urls);
    setMediaType(files[0].type.startsWith("image/") ? "image" : "video");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      content: content,
      type: mediaType === "image" ? 1 : 2, // Giả sử type 1 là hình ảnh và type 2 là video
      medias: mediaUrls,
    };

    try {
      const token = localStorage.getItem("token"); // Giả sử bạn lưu token ở localStorage
      const response = await axios.post(
        "https://network-social-sever.onrender.com/posts",
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="postForm" onSubmit={handleSubmit}>
      <div className="user form-top">
        <img src={CurrentUserData[0].ProfieImage} alt="User profile" />
        <input
          type="text"
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={handleContentChange}
        />
        <button type="submit" className="btn btn-primary">
          ĐĂNG
        </button>
      </div>

      <div className="post-categories">
        <label htmlFor="fileImage">
          <input
            type="file"
            id="fileImage"
            accept="image/*,video/*"
            multiple
            onChange={handleMediaChange}
          />
          <span>
            <FontAwesomeIcon icon={faImage} />
            Ảnh
          </span>
        </label>

        <span>
          <FontAwesomeIcon icon={faTag} />
          Tag
        </span>
        <span>
          <FontAwesomeIcon icon={faSmile} />
          Cảm xúc
        </span>
      </div>
    </form>
  );
}
