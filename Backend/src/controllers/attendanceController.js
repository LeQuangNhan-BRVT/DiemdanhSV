const pool = require('../connections/db');

//lay ds buoi hoc
exports.getSessionByClass = async(req, res)=>{
    try {
        const {classId} = req.params;
        const [sessions] = await pool.execute('SELECT * FROM sessions WHERE class_id = ? ORDER BY session_date DESC, start_time DESC',
      [classId]);

      res.json(sessions);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error!'});
    }
};

//Tao buoi hoc
exports.createSession = async(req, res)=>{
    const {class_id, session_date, start_time, end_time, session_title} = req.body;
    //Check lop hoc va role
    const[classes] = await pool.execute('SELECT * FROM classes WHERE id = ?', [class_id]);
    if(classes.length === 0){
        return res.status(404).json({message: 'Lop hoc khong ton tai'});
    }
    if(classes.user.role === 'teacher' && classes[0].teacher_id !== req.user.id){
        return res.status(403).json({message: 'Ban khong co quyen tao buoi hoc nay'});
    }
    //tao buoi hoc moi
    const [result] = await pool.execute(
        'INSERT INTO sessions (class_id, session_date, start_time, end_time, session_title) VALUES (?, ?, ?, ?, ?)',
        [class_id, session_date, start_time, end_time, session_title]
      );
     // Tạo điểm danh cho tất cả sinh viên trong lớp
     const [students] = await pool.execute(
        'SELECT student_id FROM class_enrollments WHERE class_id = ?',
        [class_id]
      );
      
      for (const student of students) {
        await pool.execute(
          'INSERT INTO attendance (session_id, student_id, status) VALUES (?, ?, ?)',
          [result.insertId, student.student_id, 'absent']
        );
      }
      
      res.status(201).json({
        id: result.insertId,
        class_id,
        session_date,
        start_time,
        end_time,
        session_title
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };
  
  // Lấy danh sách điểm danh của một buổi học
  exports.getAttendanceBySession = async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const [attendance] = await pool.execute(`
        SELECT a.*, u.full_name, u.username 
        FROM attendance a
        JOIN users u ON a.student_id = u.id
        WHERE a.session_id = ?
      `, [sessionId]);
      
      res.json(attendance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  };
  
  // Cập nhật trạng thái điểm danh
  exports.updateAttendance = async (req, res) => {
    try {
      const { id } = req.params;
      const { status, note } = req.body;
      
      await pool.execute(
        'UPDATE attendance SET status = ?, note = ?, check_in_time = CURRENT_TIMESTAMP WHERE id = ?',
        [status, note, id]
      );
      
      res.json({ message: 'Cập nhật điểm danh thành công' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }


};