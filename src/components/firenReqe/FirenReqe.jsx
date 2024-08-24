import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./firenReqe.css";
import { url } from "../../contants/url";

export default function FirenReqe() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`${url}/friendship/receive-request`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          params: {
            status: 1,
          },
        });

        setRequests(response.data); // Cập nhật trạng thái với dữ liệu yêu cầu
      } catch (error) {
        console.error("Error fetching friend requests:", error);
        setError("Có lỗi khi lấy dữ liệu yêu cầu kết bạn.");
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      // Gửi yêu cầu chấp nhận kết bạn
      await axios.post(
        `${url}/friendship/accept-request`,
        { user1: userId }, // Gửi ID của người gửi yêu cầu
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật danh sách yêu cầu sau khi chấp nhận
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.user.id !== userId)
      );
    } catch (error) {
      console.error("Error accepting friend request:", error);
      setError("Có lỗi khi chấp nhận yêu cầu kết bạn.");
    }
  };

  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      // Gửi yêu cầu từ chối kết bạn
      await axios.post(
        `${url}/friendship/reject-request`,
        { user1: userId }, // Gửi ID của người gửi yêu cầu
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật danh sách yêu cầu sau khi từ chối
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.user.id !== userId)
      );
    } catch (error) {
      console.error("Error rejecting friend request:", error);
      setError("Có lỗi khi từ chối yêu cầu kết bạn.");
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (requests.length === 0) {
    return <div></div>;
  }

  return (
    <div className="Firend-Requests">
      <h4>Yêu cầu kết bạn</h4>

      {requests.map((request) => (
        <div className="request" key={request.user.id}>
          <Link to={`/profile/${request.user.id}`}>
            <div className="info">
              <div className="user">
                <img src={request.user.avatar || "defaultAvatar.jpg"} alt="" />
                <h5>{request.user.fullname}</h5>
              </div>
              <div className="info-name">
                <p>
                  Yêu cầu kết bạn vào:{" "}
                  {new Date(request.create_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Link>

          <div className="action">
            <button
              className="btn btn-green"
              onClick={() => handleAccept(request.user.id)}
            >
              Đồng Ý
            </button>
            <button
              className="btn btn-red"
              onClick={() => handleReject(request.user.id)}
            >
              Từ Chối
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
