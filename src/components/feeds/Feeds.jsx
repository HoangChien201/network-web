import "./feeds.css";
import { useState, useEffect } from "react";
import Feed from "./Feed";
import axios from "axios";
import AddPost from "../addPost/AddPost";
import { url } from "../../contants/url";

export default function Feeds() {
  const [userRequestPosts, setUserRequestPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Thêm state cho loading
  const [error, setError] = useState(null); // Thêm state cho lỗi

  const fetchUserRequestPosts = async () => {
    try {
      // Giả sử bạn lưu token trong localStorage
      const token = localStorage.getItem("token");

      console.log("token", token);

      const response = await axios.get(`${url}/posts/get-by-user-request`, {
        headers: {
          Authorization: `Bearer ${token}`, // Thêm token vào header
        },
      });
      // Kiểm tra nếu response.data là mảng trước khi lọc
      if (Array.isArray(response.data)) {
        // Lọc bài viết có type là 1
        const filteredPosts = response.data.filter(
          (post) => post.type === 1 && post.permission === 1
        );
        setUserRequestPosts(filteredPosts);
        console.log("Danh sách bài viết", filteredPosts);
      } else {
        // Nếu response.data không phải là mảng, xử lý lỗi
        setError("Dữ liệu không phải là mảng.");
        setUserRequestPosts([]);
      }
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

  useEffect(() => {
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
      <AddPost onPostCreated={fetchUserRequestPosts} />{" "}
      {/* Luôn hiển thị AddPost */}
      {error ? (
        <div className="feeds">{error}</div>
      ) : userRequestPosts.length > 0 ? (
        userRequestPosts.map((post) => <Feed key={post.id} fed={post} />)
      ) : (
        <div>Không có bài đăng nào.</div>
      )}
    </div>
  );
}
