import "./stories.css";
import { useState, useEffect } from "react";
import axios from "axios";

//FakeAPI..........................
import CurrentUserData from "../../FackApis/CurrentUserData";

//FontAwesome.....................
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";
import { url } from "../../contants/url";

export default function UserStory() {
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
        console.log("userST",response.data);
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data");
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="story userStory">
      <div className="user">
        <img src={currentUser.avatar} alt="" />
      </div>
      <img src={currentUser.avatar} alt="" />
      <label htmlFor="storyFiles">
        <FontAwesomeIcon icon={faAdd} />
        <input type="file" id="storyFiles" />
      </label>
      <h5>Add Story</h5>
    </div>
  );
}
