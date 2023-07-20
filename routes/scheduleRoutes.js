const express = require('express');
const scheduleController = require('../controllers/scheduleController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth,  scheduleController.schedule_index);
router.get('/add/:id', requireAuth,  scheduleController.add_course);
router.get('/remove/:id', requireAuth,  scheduleController.remove_course);

module.exports = router;
