import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "./login.css";
import axios from "axios";
import Fingerprint2 from 'fingerprintjs2';
import QRCode from 'qrcode.react';
import { url } from "../../contants/url";
import { socket } from "../../../socket"; 

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  //get id device key
  const [deviceKey, setDeviceKey] = useState('');

  useEffect(() => {
    Fingerprint2.get((components) => {
      const values = components.map((component) => component.value);
      const murmur = Fingerprint2.x64hash128(values.join(''), 31);
      console.log(murmur);
      
      //nhận thong tin user được trả về khi bên mobile đẩy sang
      socket.on(`qr-login-${murmur}`,(data)=>{
        //xử lý đăng nhập
        console.log(data);
        
      })

      setDeviceKey(murmur);
    });

  }, []);
  //get id device key
  const [loadingAPI, setLoadingAPI] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      setError("Định dạng email không hợp lệ.");
      return;
    }
    setLoadingAPI(true);
    try {
      const response = await axios.post(
        `${url}/auth/sign-in/`,
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
    setLoadingAPI(false);
  };


  return (
    <div className="login">
      <div className="loginText">
        <h3 className="loginLogo">NetForge</h3>
        {/* <span className="loginDesc">
          Kết nối với bạn bè và thế giới cùng với NetForge.
        </span> */}
      </div>
      <div className="loginWrapper">
        <div className="loginLeft">
          <div className="qrcode">
            {
              deviceKey &&
              <QRCode
                value={deviceKey}
                size={256}
                bgColor="#ffffff"
                fgColor="#000000"
                level="Q"
              />
            }
          </div>
          <span>
            Sử dụng ứng dụng NetForge để quét mã QR
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
              className={
                email && password && !loadingAPI ? "loginButton" : "loginActive"
              }
              disabled={loadingAPI || !(email && password)}
              onClick={handleLogin}
            >
              {loadingAPI ? (
                <span>
                  <FontAwesomeIcon icon={faSpinner} spin/>
                </span>
              ) : (
                "Đăng nhập"
              )}
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
