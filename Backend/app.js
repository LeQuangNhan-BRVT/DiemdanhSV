const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoute = require('./src/routes/authRoute');
const attendanceRoute = require('./src/routes/attendanceRoute');
const classRoute = require('./src/routes/classRoute');
const userRoute = require('./src/routes/userRoute');
const app = express();
const PORT = process.env.PORT||5000;

//Middleware
app.use(cors());
app.use(express.json());

//routes
app.use('/auth', authRoute);
app.use('/attendance', attendanceRoute);
app.use('./class', classRoute);
app.use('/users', userRoute);

app.get('/', (req, res)=>{
    res.send('Diem danh dang chay!');
});
app.listen(PORT, ()=>{
    console.log('Server dang chay cong ${PORT}');
})