const express = require('express');
const courseController = require('../controllers/courseController');
const { requireAuth } = require('../middleware/authMiddleware')

const router = express.Router();

router.get('/', courseController.courses_index);
router.post('/', requireAuth,  courseController.courses_post);
router.get('/create', requireAuth,  courseController.courses_create);
router.get('/update/:id', requireAuth,  courseController.courses_update_page);
router.get('/:id', courseController.courses_details);
router.put('/:id', requireAuth,  courseController.courses_update);
router.delete('/:id', requireAuth,  courseController.courses_delete);
router.get('/mass_add', requireAuth,  courseController.courses_mass_add);

module.exports = router;