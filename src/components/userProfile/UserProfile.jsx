import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Comments from "../comments/Comments";
import "./userProfile.css";
import "../../components/feeds/feeds.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faFeed,
  faLink,
  faMessage,
  faUserPlus,
  faListAlt,
  faHeart,
  faComment,
  faShare,
  faUser,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import ImageModal from "../Modal/ImageModal";
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

// Hàm để lấy ID người dùng hiện tại từ localStorage
const getCurrentUserId = () => {
  return localStorage.getItem("userId"); // Giả sử bạn lưu ID người dùng với khóa "userId"
};

export default function UserProfile() {
  const { id } = useParams(); // Lấy id từ URL
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]); // State để lưu bài viết của người dùng
  const [error, setError] = useState(null);

  const [openComments, setOpenComments] = useState({}); // State để lưu trạng thái bình luận cho từng bài viết

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // State theo dõi trạng thái kết bạn
  const [hasSentRequest, setHasSentRequest] = useState(false);

  // State để theo dõi trạng thái like cho từng bài viết
  const [likedPosts, setLikedPosts] = useState({});

  const likeHandler = async (postId) => {
    try {
      const response = await axios.post(
        `${url}/like-posts`,
        {
          posts: postId, // ID của bài viết
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        // Tìm bài viết và cập nhật số lượng likes
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  like_count: post.like_count
                    ? (parseInt(post.like_count) + 1).toString()
                    : "1",
                }
              : post
          )
        );
        // Cập nhật trạng thái like của bài viết
        setLikedPosts((prevLikedPosts) => ({
          ...prevLikedPosts,
          [postId]: !prevLikedPosts[postId],
        }));
      } else {
        console.error("Lỗi khi tạo like:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu like:", error);
    }
  };

  const fetchComments = async (postId) => {
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
      setOpenComments((prev) => ({
        ...prev,
        [postId]: {
          open: true,
          comments: response.data,
        },
      }));
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const commentHandler = (postId) => {
    if (!openComments[postId]?.open) {
      fetchComments(postId);
    }
    setOpenComments((prev) => ({
      ...prev,
      [postId]: {
        ...prev[postId],
        open: !prev[postId]?.open,
      },
    }));
  };

  const openImageModal = (url) => {
    setSelectedImage(url);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        // Fetch user data
        const userResponse = await axios.get(`${url}/user/get-one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Fetch posts of the user
        const postsResponse = await axios.get(
          `${url}/posts/get-by-user/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Initialize likedPosts state
        const initialLikedPosts = {};
        postsResponse.data.forEach((post) => {
          initialLikedPosts[post.id] = false; // Hoặc true nếu bài viết đã được like
        });
        // Lọc bài viết có type là 1
        const filteredPosts = postsResponse.data.filter(
          (post) => post.type === 1
        );

        console.log("Thông tin cá nhân", userResponse.data);
        console.log("Bài viết cá nhân", filteredPosts);
        setUser(userResponse.data); // Cập nhật dữ liệu người dùng
        setPosts(filteredPosts); // Cập nhật dữ liệu bài viết
        setLikedPosts(initialLikedPosts); // Khởi tạo trạng thái like cho các bài viết
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Có lỗi khi lấy dữ liệu.");
      }
    };

    fetchUserAndPosts();
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  // Lấy ID của người dùng hiện tại từ localStorage
  const currentUserId = getCurrentUserId();

  // Format ngày sinh nhật
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  // Xử lý trạng thái mối quan hệ
  const relationshipStatus = (relationship) => {
    if (!relationship) return "N/A";
    if (relationship.status === 2) {
      return "Bạn bè";
    }
    switch (relationship.status) {
      case 1:
        return "Single";
      case 2:
        return "In a Relationship";
      case 3:
        return "Married";
      default:
        return "N/A";
    }
  };

  const sendFriendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const userId = getCurrentUserId(); // ID của người dùng gửi yêu cầu
      const targetUserId = id; // ID của người dùng nhận yêu cầu

      if (!token || !userId || !targetUserId) {
        throw new Error("Thông tin cần thiết không có.");
      }

      const response = await axios.post(
        `${url}/friendship/`,
        {
          user2: targetUserId,
          status: 1, //status là 1 cho yêu cầu kết bạn mới
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        console.log("Yêu cầu kết bạn đã được gửi thành công");
        // Cập nhật giao diện hoặc thông báo cho người dùng
        setHasSentRequest(true);
      } else if (response.data.message === "Yêu cầu kết bạn đã tồn tại.") {
        console.log("Yêu cầu kết bạn đã tồn tại.");
        // Xử lý khi yêu cầu kết bạn đã tồn tại
        setHasSentRequest(true);
      } else {
        console.error("Lỗi khi gửi yêu cầu kết bạn:", response.data.message);
        setHasSentRequest(true);
      }
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu kết bạn:", error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      const token = localStorage.getItem("token");
      const targetUserId = id; // ID của người dùng nhận yêu cầu

      if (!token || !targetUserId) {
        throw new Error("Thông tin cần thiết không có.");
      }

      const response = await axios.post(
        `${url}/friendship/cancle-request`,
        {
          user2: targetUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === 200) {
        console.log("Yêu cầu kết bạn đã được hủy thành công");
        // Cập nhật giao diện hoặc thông báo cho người dùng
        setHasSentRequest(false);
      } else {
        console.error("Lỗi khi hủy yêu cầu kết bạn:", response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi hủy yêu cầu kết bạn:", error);
    }
  };

  // Hàm để xác định trạng thái kết bạn
  const renderFriendButton = () => {
    if (user.relationship && user.relationship.status === 2) {
      return (
        <button className="btn btn-secondary">
          <FontAwesomeIcon icon={faUser} style={{ paddingRight: "5px" }} />
          Bạn bè
        </button>
      );
    } else if (hasSentRequest) {
      return (
        <button className="btn btn-secondary" onClick={cancelFriendRequest}>
          <FontAwesomeIcon icon={faBan} style={{ paddingRight: "5px" }} />
          Hủy yêu cầu
        </button>
      );
    } else if (currentUserId !== id) {
      return (
        <button className="btn btn-primary" onClick={sendFriendRequest}>
          <FontAwesomeIcon icon={faUserPlus} style={{ paddingRight: "5px" }} />
          Kết bạn
        </button>
      );
    }
    return null;
  };

  // Sử dụng comment_count từ dữ liệu nếu có, mặc định là 0 nếu không có
  const commentsCount = (postId) => {
    return (
      openComments[postId]?.comments?.length ||
      posts.find((post) => post.id === postId)?.comment_count ||
      0
    );
  };

  return (
    <div className="userProfile">
      <div className="cover-photos">
        <img src={user.background} alt="Cover" />
      </div>
      <div className="profile-info">
        <img src={user.avatar || "defaultProfileImage.jpg"} alt="Profile" />
        <div className="user-name">
          <h3>{user.fullname}</h3>
          <h5>{user.email}</h5>
        </div>
        <div className="profile-button">
          <Link to="/chatbox">
            <button className="btn btn-primary">
              <FontAwesomeIcon icon={faMessage} />
            </button>
          </Link>
          {renderFriendButton()}
          {/* <button className="btn btn-primary">
            <FontAwesomeIcon
              icon={faUserPlus}
              style={{ paddingRight: "5px" }}
            />
            Kết bạn
          </button> */}

          <button className="btn">
            <FontAwesomeIcon icon={faLink} />
          </button>
        </div>
        {/* <p className="bio">
          Giới tính: {user.gender ?? "null"} <br />
          Quê quán: {user.address ?? "null"} <br />
          Điện thoại: {user.phone ?? "null"} <br />
          Sinh nhật: {user.dateOfBirth
            ? formatDate(user.dateOfBirth)
            : "N/A"}{" "}
          <br />
          Relationship: {relationshipStatus(user.relationship)}
        </p> */}
      </div>

      {/* Hiển thị bài viết của người dùng */}
      <div className="feeds">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="feed">
              <div className="top-content">
                <Link to={`/profile/${post.creater.id}`}>
                  <div className="user">
                    <img
                      src={post.creater.avatar}
                      alt={`${post.creater.fullname}'s profile`}
                    />
                    <div>
                      <h5>{post.creater.fullname}</h5>
                      <small>{timeAgo(post.create_at)}</small>{" "}
                      {/* Hiển thị thời gian đã trôi qua */}
                    </div>
                  </div>
                </Link>
                <span>
                  <FontAwesomeIcon icon={faListAlt} />
                </span>
              </div>
              <div className="mid-content">
                <p>{post.content}</p>
                {post.media.length > 0 &&
                post.media[0].resource_type === "video" ? (
                  <video
                    src={post.media[0].url}
                    controls
                    className="post-media"
                  />
                ) : post.media.length > 0 ? (
                  <img
                    src={post.media[0].url}
                    alt="Post Media"
                    onClick={() => openImageModal(post.media[0].url)}
                    className="media-content"
                  />
                ) : null}
              </div>
              <div className="bottom-content">
                <div
                  className="action-item"
                  onClick={() => likeHandler(post.id)}
                >
                  <span>
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`like ${likedPosts[post.id] ? "liked" : ""}`}
                      style={{ paddingRight: "4px" }}
                    />
                    {post.like_count || 0} Thích
                  </span>
                </div>
                <div
                  className="action-item"
                  onClick={() => commentHandler(post.id)}
                >
                  <span>
                    <FontAwesomeIcon icon={faComment} />{" "}
                    {commentsCount(post.id)} Bình luận
                  </span>
                </div>
                <div className="action-item">
                  <span>
                    <FontAwesomeIcon icon={faShare} /> {post.share_count || 0}{" "}
                    Chia sẻ
                  </span>
                </div>
              </div>
              {openComments[post.id]?.open && (
                <Comments comments={openComments[post.id]?.comments} />
              )}
              <ImageModal
                isOpen={isModalOpen}
                onClose={closeImageModal}
                imageUrl={selectedImage}
              />
            </div>
          ))
        ) : (
          <div>No posts available</div>
        )}
      </div>
    </div>
  );
}
