const pool = require("../connections/db");

exports.getClass = async (req, res) => {
  try {
    const { role, id } = req.body;
    if (role === "admin") {
      //xem tat ca lop hoc
      [classes] = await pool.execute(
        "SELECT c.*, u.full_name as teacher_name FROM classes c JOIN users u ON c.teacher_id = u.id"
      );
    } else if (role === "teacher") {
      //giao vien xem lop cua minh day
      [classes] = await pool.execute(
        "SELECT c.*, u.full_name as teacher_name FROM classes c JOIN users u ON c.teacher_id = u.id WHERE c.teacher_id = ?",
        [id]
      );
    } else {
      //sinh xem lop cua minh
      [classes] = await pool.execute(
        "SELECT c.*, u.full_name as teacher_name FROM classes c JOIN users u ON c.teacher_id = u.id JOIN class_enrollments ce ON c.id = ce.class_id WHERE ce.student_id = ?",
        [id]
      );
    }
    res.json(classes);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Server error!'});
  }
};

//Them mot lop hoc
exports.addClass = async(req, res)=>{
    try {
        const {class_name, class_code, semester, academic_year} = req.body;
        const teacher_id = req.user.role === 'admin'? req.body.teacher_id : req.user.id;

        //check lop hoc
        const [existingClasses] = await pool.execute('SELECT * FROM classes WHERE class_code = ?', [class_code]);
        if(existingClasses.length>0){
            return res.status(400).json({message: 'Da ton tai ma lop hoc'});
        }
        //them lop hoc moi
        const [result] = await pool.execute('INSERT INTO classes (class_name, class_code, teacher_id, semester, academic_year) VALUES (?,?,?,?,?)', [class_name, class_code, teacher_id, semester, academic_year]);

        res.status(201).json({id: result.insertId, class_name, class_code, teacher_id, semester, academic_year});
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error!'});
    }
};
