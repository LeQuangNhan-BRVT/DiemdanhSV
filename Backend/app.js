const express = require("express");
const bodyParser = require("body-parser");
const db = require("./src/models");
const cors = require("cors");
require("dotenv").config();

const authRoute = require("./src/routes/authRoute");
const adminRoute = require("./src/routes/adminRoute");
const attendanceRoute = require("./src/routes/attendanceRoute");
const classRoute = require("./src/routes/classRoute");
const studentRoute = require("./src/routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(bodyParser.json());

//routes
app.use("/auth", authRoute);
app.use("/admin", adminRoute);
app.use("/attendance", attendanceRoute);
app.use("/classes", classRoute);
app.use("/students", studentRoute);

// Middleware xử lý lỗi tập trung (đặt cuối cùng)
app.use((err, req, res, next) => {
  console.error("-------------------- ERROR --------------------");
  console.error("Timestamp:", new Date().toISOString());
  console.error("Route:", req.method, req.originalUrl);
  // Log thêm thông tin nếu cần (req.body, req.user, ...)
  console.error("Error Stack:", err.stack);
  console.error("---------------------------------------------");

  // Không gửi stack trace chi tiết cho client trong môi trường production
  const statusCode = err.statusCode || 500;
  const message =
    process.env.NODE_ENV === "production" && statusCode === 500
      ? "Internal Server Error"
      : err.message || "Something went wrong!";

  res.status(statusCode).json({ error: message });
});
// Sync database and start server
db.sequelize
  .sync() // { force: true } chỉ dùng khi dev để xóa và tạo lại bảng
  .then(() => {
    console.log("Database synced successfully.");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
    process.exit(1); // Thoát nếu không kết nối được DB
  });
