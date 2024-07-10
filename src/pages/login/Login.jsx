import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import axios from "axios";

import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ.");
      return;
    }

    try {
      const response = await axios.post(
        "https://network-social-sever.onrender.com/auth/sign-in/",
        { email, password }
      );
      localStorage.setItem("token", response.data.data.token);
      setError("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      setError(
        "Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin đăng nhập."
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
            <h5 className="loginTitle">Đăng nhập</h5>
            {error && <span className="loginError">{error}</span>}
            <input
              type="email"
              placeholder="Email"
              className="loginInput"
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

            <button
              className={email && password ? "loginButton" : "loginActive"}
              disabled={email && password ? false : true}
              onClick={() => handleLogin()}
            >
              Đăng nhập
            </button>
            <span className="loginForgot">Quên mật khẩu?</span>
            <Link to="/signup" className="loginRegisterButton">
              <button className="loginRegisterButton">Tạo tài khoản mới</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
