const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = (req, res, next) => {
  const token = req.header.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Không có token xác thực!" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token không hợp lệ!" });
  }
};

//check role
const checkRole = (roles)=>{
    return (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return res.status(403).json({message: 'Bạn không có quyền thao tác này!'});
        }
        next();
    };
};
module.exports = {verifyToken, checkRole};
