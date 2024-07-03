import { useState } from "react";
import "./signup.css";
import axios from "axios";

import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ.");
      return;
    }

    if (password.length <= 5) {
      setError("Mật khẩu phải dài hơn 5 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        { username, email, password }
      );
      setError("Đăng ký thành công!");
      navigate("/login");
    } catch (error) {
      setError(
        "Đăng ký không thành công. Vui lòng kiểm tra lại thông tin đăng ký."
      );
    }
  };

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">NetForge</h3>
          <span className="loginDesc">
            Kết nối với bạn bè và thế giới cùng với NetForge.
          </span>
        </div>
        <div className="loginRight">
          <div className="loginBox">
            <h5 className="loginTitle">Đăng ký</h5>
            {error && <span className="loginError">{error}</span>}
            <input
              placeholder="Tên"
              className="loginInput"
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <input
              placeholder="Email"
              className="loginInput"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="loginInput"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="loginInput"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button className="loginButton" onClick={handleRegister}>
              Đăng ký
            </button>
            <Link to="/login" className="loginRegisterButton">
              <button className="loginRegisterButton">
                Đăng nhập với tài khoản
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
