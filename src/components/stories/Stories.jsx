import "./stories.css";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import axios from "axios";
import UserStory from "./UserStory";
import StoryModal from "../Modal/StoryModal";
import { url } from "../../contants/url";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(null); // Sử dụng index thay vì object story
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoAdvanceTimeout, setAutoAdvanceTimeout] = useState(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${url}/posts/get-by-user-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Lọc bài đăng có type là 2
        const filteredStories = response.data.filter((post) => post.type === 2);

        // Nhóm các story theo user_id
        const groupedStories = filteredStories.reduce((acc, story) => {
          const userId = story.creater?.id;
          if (!acc[userId]) {
            acc[userId] = { ...story, stories: [] };
          }
          acc[userId].stories.push(story);
          return acc;
        }, {});

        setStories(Object.values(groupedStories));
        console.log("Grouped stories", Object.values(groupedStories));
      } catch (error) {
        console.error("Error fetching stories:", error);
        if (error.response) {
          setError(`Server responded with status: ${error.response.status}`);
        } else if (error.request) {
          setError("No response received from server");
        } else {
          setError(`Error: ${error.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  useEffect(() => {
    if (isModalOpen && stories.length > 0 && selectedStoryIndex !== null) {
      const advanceStory = () => {
        setAutoAdvanceTimeout(
          setTimeout(() => {
            setSelectedStoryIndex((prevIndex) => {
              if (prevIndex === null || prevIndex >= stories.length - 1) {
                setIsModalOpen(false);
                return null; // Reset index to avoid out of bounds
              }
              return prevIndex + 1;
            });
          }, 7000)
        );
      };

      advanceStory();

      // Clean up timeout on component unmount or when modal closes
      return () => clearTimeout(autoAdvanceTimeout);
    }
  }, [isModalOpen, stories, selectedStoryIndex]); // Chỉ thêm các phụ thuộc cần thiết

  const openModal = (index) => {
    setSelectedStoryIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStoryIndex(null);
    if (autoAdvanceTimeout) clearTimeout(autoAdvanceTimeout);
  };

  if (loading) {
    return <div className="stories">Đang tải...</div>;
  }

  if (error) {
    return <div className="stories">{error}</div>;
  }

  return (
    <div className="stories">
      <UserStory />
      <Swiper style={{ width: "80%" }} slidesPerView={4} spaceBetween={10}>
        {stories.map((story, index) => (
          <SwiperSlide key={story.id}>
            <div className="story" onClick={() => openModal(index)}>
              <div className="user">
                <img
                  src={story.creater?.avatar || "defaultAvatar.jpg"}
                  alt={story.creater?.fullname || "User"}
                />
              </div>
              {story.media && story.media.length > 0 ? (
                story.media[0]?.resource_type === "video" ? (
                  <video
                    src={story.media[0]?.url}
                    alt={`Story by ${story.creater?.fullname}`}
                    className="story-media"
                    controls
                  />
                ) : (
                  <img
                    src={story.media[0]?.url || story.creater?.avatar}
                    alt={`Story by ${story.creater?.fullname}`}
                    className="story-media"
                  />
                )
              ) : (
                <div
                  className="story-media"
                  style={{ background: "url(defaultStoryBackground.jpg)" }}
                >
                  {/* Nếu không có media, hiển thị background mặc định */}
                </div>
              )}
              <h5>{story.creater?.fullname || "User Name"}</h5>
              <p className="story-content" style={{ marginTop: "10px" }}>
                {story.content}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {isModalOpen && selectedStoryIndex !== null && (
        <StoryModal
          isOpen={isModalOpen}
          onClose={closeModal}
          mediaUrl={stories[selectedStoryIndex]?.media?.[0]?.url || ""}
          resourceType={
            stories[selectedStoryIndex]?.media?.[0]?.resource_type || ""
          }
          title={stories[selectedStoryIndex]?.creater?.fullname || ""}
          content={stories[selectedStoryIndex]?.content || ""}
        />
      )}
    </div>
  );
}
