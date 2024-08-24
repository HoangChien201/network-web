import "./addPost.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faSmile, faTag } from "@fortawesome/free-solid-svg-icons";
import CurrentUserData from "../../FackApis/CurrentUserData";
import { url } from "../../contants/url";

export default function AddPost({ onPostCreated }) {
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaType, setMediaType] = useState(""); // image hoặc video
  const [tags, setTags] = useState([]); // Giả sử bạn có một phương thức để thêm tags
  const [permission, setPermission] = useState(1); // Giả sử mặc định là friend
  const [error, setError] = useState(null); // Để lưu trữ lỗi

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User not found");
        return;
      }

      try {
        const response = await axios.get(
          `${url}/user/get-one/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        console.log(response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    // const urls = files.map((file) => ({
    //   url: URL.createObjectURL(file),
    //   resource_type: file.type.startsWith("image/") ? "image" : "video",
    // }));
    setMediaFiles(files);
    setMediaType(files[0].type.startsWith("image/") ? "image" : "video");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // Kiểm tra dữ liệu trước khi gửi
    // if (!content || !mediaType || mediaFiles.length === 0) {
    //   setError("Vui lòng nhập nội dung và chọn ảnh/video.");
    //   return;
    // }

    // Kiểm tra dữ liệu trước khi gửi
    if (!content) {
      setError("Vui lòng nhập nội dung và chọn ảnh/video.");
      return;
    }

    // const postData = {
    //   content: content,
    //   type: mediaType === "image" ? 1 : 2,
    //   permission: permission,
    //   tags: tags,
    //   medias: mediaFiles,
    // };

    const uploadMedia = async (file) => {
      const formData = new FormData();
      formData.append("files", file);
      const data = await axios.post(
        `${url}/image/uploads`,
        formData
      );
      return data;
    };

    try {
      const token = localStorage.getItem("token"); // Giả sử bạn lưu token ở localStorage
      if (!token) {
        throw new Error("Token không tồn tại. Vui lòng đăng nhập lại.");
      }

      // Upload tất cả các file media và lấy URL
      const mediaUrls = await Promise.all(mediaFiles.map(uploadMedia));
      console.log(mediaUrls);

      const postData = {
        content: content,
        type: 1,
        permission: permission,
        tags: tags,
        emotion: 0,
        medias: mediaUrls.map((media) => ({
          url: media.data[0].url,
          resource_type: media.data[0].resource_type,
        })),
      };

      console.log(postData);

      const response = await axios.post(
        `${url}/posts`,
        postData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Response data:", response.data);

      if (response.data.status === -1) {
        setError(response.data.message);
      } else {
        setError(null); // Xóa lỗi nếu thành công
        setContent(""); // Đặt lại nội dung bài đăng
        setMediaFiles([]); // Xóa file media
        setMediaType(""); // Đặt lại loại media
        onPostCreated(); // Gọi hàm callback để cập nhật danh sách bài viết
      }
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Có lỗi xảy ra khi tạo bài đăng. Vui lòng thử lại."); // Lưu trữ lỗi để hiển thị cho người dùng
    }
  };

  return (
    <form className="postForm" onSubmit={handleSubmit}>
      <div className="user form-top">
        <img src={currentUser.avatar || ""} alt="User profile" />
        <input
          type="text"
          placeholder="Bạn đang nghĩ gì?"
          value={content}
          onChange={handleContentChange}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={!content && mediaFiles.length === 0}
        >
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
            <FontAwesomeIcon icon={faImage} style={{ paddingRight: "10px" }} />
            Ảnh/Video
          </span>
        </label>

        <span>
          <FontAwesomeIcon icon={faTag} style={{ paddingRight: "10px" }} />
          Tag
        </span>
        <span>
          <FontAwesomeIcon icon={faSmile} style={{ paddingRight: "10px" }} />
          Cảm xúc
        </span>
      </div>
      {mediaFiles.length > 0 && (
        <div className="preview">
          {mediaFiles.map((media, index) => (
            <div key={index} className="preview-item">
              {media.type.startsWith("image/") ? (
                <img src={URL.createObjectURL(media)} alt={`media ${index}`} />
              ) : (
                <video src={URL.createObjectURL(media)} controls />
              )}
            </div>
          ))}
        </div>
      )}
      {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi */}
    </form>
  );
}
