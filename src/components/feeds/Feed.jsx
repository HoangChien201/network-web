import "./feeds.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faComment,
  faHeart,
  faListAlt,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../Modal/ImageModal";
import axios from "axios";
import { url } from "../../contants/url";

// Hàm để tính thời gian đã trôi qua
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

  return "vừa xong"; // Trong trường hợp chưa đến một giây
};

export default function Feed({ fed }) {
  const [openComment, setOpenComment] = useState(false);
  const [like, setLike] = useState(fed.like_count || 0);
  const [isLiked, setIsLiked] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0); // Thêm state để theo dõi chỉ số media hiện tại

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const userReaction = isLiked ? 2 : 1; // Ví dụ: 1 là like, 2 là dislike

  const likeHandler = async () => {
    try {
      const response = await axios.post(
        `${url}/like-posts`,
        {
          posts: fed.id,
          reaction: userReaction,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        setIsLiked(!isLiked);
        setLike(isLiked ? like - 1 : like + 1);
      } else {
        console.error("Lỗi khi tạo like:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu like:", error);
    }
  };

  const commentHandler = () => {
    setOpenComment(!openComment);
  };

  const openImageModal = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + fed.media.length) % fed.media.length
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % fed.media.length);
  };

  const mediaUrl =
    fed.media && fed.media.length > 0 ? fed.media[currentIndex].url : null;
  const mediaType =
    fed.media && fed.media.length > 0
      ? fed.media[currentIndex].resource_type
      : null;

  const commentsCount = parseInt(fed.comment_count) || 0;

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
              <small>{timeAgo(fed.create_at)}</small>
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
          <div className="media-container">
            {mediaType === "video" ? (
              <video controls width="100%" style={{ maxHeight: "480px" }}>
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : mediaType === "image" ? (
              <img
                src={mediaUrl}
                alt="Posted media"
                onClick={() => openImageModal(mediaUrl)}
                className="media-content"
              />
            ) : null}
            {fed.media.length > 1 && (
              <>
                <div className="media-navigation">
                  <button className="prev-button" onClick={handlePrev}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button className="next-button" onClick={handleNext}>
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
                <div className="dots-container">
                  {fed.media.map((_, index) => (
                    <span
                      key={index}
                      className={`dot ${
                        index === currentIndex ? "active" : ""
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
      <div className="bottom-content">
        <div className="action-item" onClick={likeHandler}>
          <span>
            <FontAwesomeIcon
              icon={faHeart}
              className={`like ${isLiked ? "liked" : ""}`}
              style={{ paddingRight: "4px" }}
            />
            {like || 0} Thích
          </span>
        </div>
        <div className="action-item" onClick={commentHandler}>
          <span>
            <FontAwesomeIcon icon={faComment} /> {commentsCount} Bình luận
          </span>
        </div>
        <div className="action-item">
          <span>
            <FontAwesomeIcon icon={faShare} /> {fed.share_count || 0} Chia sẻ
          </span>
        </div>
      </div>
      {openComment && <Comments postId={fed.id} />}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        imageUrl={selectedImage}
      />
    </div>
  );
}
