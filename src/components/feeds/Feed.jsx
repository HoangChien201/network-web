import "./feeds.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faComment,
  faHeart,
  faListAlt,
  faShare,
} from "@fortawesome/free-solid-svg-icons";

export default function Feed({ fed }) {
  const [openComment, setOpenComment] = useState(false);
  const [like, setLike] = useState(fed.like_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  const commentHandler = () => {
    setOpenComment(!openComment);
  };

  // Sử dụng comment_count từ dữ liệu nếu có, mặc định là 0 nếu không có
  const commentsCount = fed.comment_count || 0;

  return (
    <div className="feed" key={fed.id}>
      <div className="top-content">
        <Link to={`/profile/${fed.creater.id}`}>
          <div className="user">
            <img
              src={fed.creater.avatar}
              alt={`${fed.creater.fullname}'s profile`}
            />
            <div>
              <h5>{fed.creater.fullname}</h5>
              <small>1 minute ago</small>
            </div>
          </div>
        </Link>
        <span>
          <FontAwesomeIcon icon={faListAlt} />
        </span>
      </div>
      <div className="mid-content">
        <p>{fed.content}</p>
        {fed.media && fed.media.length > 0 && (
          <img src={fed.media[0]} alt="Posted media" />
        )}
      </div>
      <div className="bottom-content">
        <div className="action-item" onClick={likeHandler}>
          <span>
            <FontAwesomeIcon
              icon={faHeart}
              className={`like ${isLiked ? "liked" : ""}`}
            />{" "}
            {like} like
          </span>
        </div>
        <div className="action-item" onClick={commentHandler}>
          <span>
            <FontAwesomeIcon icon={faComment} /> {commentsCount} Comment
          </span>
        </div>
        <div className="action-item">
          <span>
            <FontAwesomeIcon icon={faShare} /> {fed.share_count || 0} Share
          </span>
        </div>
      </div>
      {openComment && <Comments postId={fed.id} />}
    </div>
  );
}
