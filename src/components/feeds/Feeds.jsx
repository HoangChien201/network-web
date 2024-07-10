import "./feeds.css";
import { useState, useEffect } from "react";
import Feed from "./Feed";
import axios from "axios";

export default function Feeds() {
  const [userRequestPosts, setUserRequestPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state cho loading
  const [error, setError] = useState(null); // Thêm state cho lỗi

  useEffect(() => {
    const fetchUserRequestPosts = async () => {
      try {
        // Giả sử bạn lưu token trong localStorage
        const token = localStorage.getItem("token");

        console.log('token',token);

        const response = await axios.get(
          "https://network-social-sever.onrender.com/posts/get-by-user-request",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Thêm token vào header
            },
          }
        );
        setUserRequestPosts(response.data);
      } catch (error) {
        console.error("Error fetching user_request posts:", error);
        if (error.response) {
          // Server responded with a status other than 200 range
          setError(`Server responded with status: ${error.response.status}`);
        } else if (error.request) {
          // Request was made but no response was received
          setError("No response received from server");
        } else {
          // Something happened in setting up the request
          setError(`Error: ${error.message}`);
        }
        setUserRequestPosts([]);
      } finally {
        setLoading(false); // Đảm bảo cập nhật trạng thái loading
      }
    };

    fetchUserRequestPosts();
  }, []);

  if (loading) {
    return <div className="feeds">Đang tải...</div>;
  }

  if (error) {
    return <div className="feeds">{error}</div>;
  }

  return (
    <div className="feeds">
      {userRequestPosts.length > 0 ? (
        userRequestPosts.map((post) => <Feed key={post.id} fed={post} />)
      ) : (
        <div>Không có bài đăng nào.</div>
      )}
    </div>
  );
}
