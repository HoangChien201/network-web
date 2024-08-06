import React, { useState, useEffect } from "react";
import axios from "axios";
import "./comments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `https://network-sever-1.onrender.com/comment/get-by-posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [postId]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated.");
      }
      const response = await axios.post(
        "https://network-sever-1.onrender.com/comment/",
        { posts_id: postId, content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments([...comments, response.data]); // Thêm bình luận mới vào danh sách
      setNewComment(""); // Xóa nội dung nhập
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  return (
    <div className="comments">
      <div className="writebox">
        <form onSubmit={handleCommentSubmit}>
          <div className="user">
            <input
              type="text"
              placeholder="Viết bình luận"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              <FontAwesomeIcon icon={faPaperPlane}/>
              Gửi
            </button>
          </div>
        </form> 
      </div>
      {comments.map((comment) => (
        <div className="user" key={comment.id}>
          <img src={comment.user.avatar} alt="User Avatar" />
          <div>
            <h5>{comment.user.fullname}</h5>
            <p>{comment.content}</p>
            <small>Thích</small>
            <small>Trả lời</small>
          </div>
          <small>{new Date(comment.createdAt).toLocaleString()}</small>
        </div>
      ))}
    </div>
  );
}
