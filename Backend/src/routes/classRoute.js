const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, classController.getClasses);
router.post('/', verifyToken, checkRole(['admin', 'teacher']), classController.addClass);

module.exports = router;