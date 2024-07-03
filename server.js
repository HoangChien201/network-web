const express = require("express");
const cors = require("cors");
const app = express();

const bodyParser = require("body-parser");

// Kích hoạt CORS cho tất cả các yêu cầu từ domain của frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Hoặc địa chỉ của frontend của bạn
    credentials: true, // Cho phép gửi cookie hoặc token (nếu có)
  })
);

app.use(bodyParser.json());

// Các route và middleware khác của ứng dụng Express
// Ví dụ:
app.post("/login", (req, res) => {
  const { email, password } = req.body;
});
// app.get('/api/users', (req, res) => {
//   // Xử lý yêu cầu
// });

app.listen(8800, () => {
  console.log("Server is running on http://localhost:8800");
});
