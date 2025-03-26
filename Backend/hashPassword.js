// Script nhỏ để hash password (chạy bằng node hashScript.js)
const bcrypt = require('bcrypt');
const password = 'admin123'; // Thay bằng password bạn muốn
bcrypt.hash(password, 10).then(hash => console.log(hash));