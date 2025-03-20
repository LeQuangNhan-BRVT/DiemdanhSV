const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../connections/db');
require('dotenv').config();

exports.login = async(req, res)=>{
    try {
        const {username, password} = req.body;
        const [users] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if(users.length === 0){
            return res.status(401).json({message: 'Tên đăng nhập hoặc mật khẩu không đúng!'});
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({message: 'Tên đăng nhập hoặc mật khẩu không đúng!'});
        }

        //JWT
        const token = jwt.sign(
            {
                id: user.id, username: user.username, role: user.role
            }, {expiresIn: '1h'}
        );

        res.json({
            token, user: {id: user.id, username: user.username, fullname: user.full_name, email: user.email, role: user.role}
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error!'});
    }
};