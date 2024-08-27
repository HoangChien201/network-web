import React, { useState, useEffect } from "react";
import axios from "axios";
import "./comments.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { url } from "../../contants/url";

const timeAgo = (dateString) => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - postDate) / 1000);

  const intervals = [
    { unit: "năm", seconds: 31536000 },
    { unit: "tháng", seconds: 2592000 },
    { unit: "ngày", seconds: 86400 },
    { unit: "giờ", seconds: 3600 },
    { unit: "phút", seconds: 60 },
    { unit: "giây", seconds: 1 },
  ];

  for (const { unit, seconds } of intervals) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit} trước`;
    }
  }

  return "vừa xong";
};

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${url}/comment/get-by-posts/${postId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        if (Array.isArray(response.data)) {
          const validComments = response.data.filter(
            (comment) => comment.user && comment.user.avatar
          );
          setComments(validComments);
        }
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
      const response = await axios.post(
        `${url}/comment/`,
        {
          posts_id: postId,
          content: newComment,
          parent: null,
          image: null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleReplyFetch = async (commentId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${url}/comment/get-by-comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComments = comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              replies: response.data,
              replyCount: response.data.length,
            }
          : comment
      );

      setComments(updatedComments);
      console.log("Trả lời bình luận", response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.error("Không thấy trả lời:", error.response.data);
      } else {
        console.error("Có lỗi khi lấy dữ liệu", error);
      }
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
              <FontAwesomeIcon icon={faPaperPlane} />
              Gửi
            </button>
          </div>
        </form>
      </div>
      {comments.map((comment) => (
        <div key={comment.id} className="comment">
          <div className="user">
            <div className="user-info">
              <img
                src={comment.user.avatar}
                alt="Avatar user"
                className="avatar-user"
              />
              <h5>{comment.user.fullname}</h5>
            </div>
            <small>{timeAgo(comment.create_at)}</small>
          </div>
          <div className="comment-image">
            <p>{comment.content}</p>
            {comment.image &&
            (comment.image.endsWith(".mp4") ||
              comment.image.endsWith(".webm")) ? (
              <video controls src={comment.image} className="comment-video" />
            ) : comment.image ? (
              <img
                src={comment.image}
                alt="Comment image"
                className="comment-image"
              />
            ) : (
              ""
            )}
            <small>
              <FontAwesomeIcon icon={faHeart} />
            </small>
            <small onClick={() => handleReplyFetch(comment.id)}>
              Xem {comment.replies ? comment.replies.length : ""} trả lời
            </small>
          </div>

          {comment.replies &&
            comment.replies.map((reply) => (
              <div key={reply.id} className="reply">
                <div className="user">
                  <div className="user-info">
                    <img
                      src={reply.user?.avatar || "/path/to/default/avatar.jpg"}
                      alt="User Avatar"
                    />
                    <h5>{reply.user?.fullname}</h5>
                  </div>
                  <small>{timeAgo(reply.create_at)}</small>
                </div>
                <div className="reply-content">
                  <p>{reply.content}</p>
                  {reply.image &&
                  (reply.image.endsWith(".mp4") ||
                    reply.image.endsWith(".webm")) ? (
                    <video controls src={reply.image} className="reply-video" />
                  ) : reply.image ? (
                    <img
                      src={reply.image}
                      alt="Reply image"
                      className="reply-image"
                    />
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
