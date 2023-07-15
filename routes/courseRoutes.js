const express = require('express');
const courseController = require('../controllers/courseController');

const router = express.Router();

router.get('/', courseController.courses_index);
router.post('/', courseController.courses_post);
router.get('/create', courseController.courses_create);
router.get('/update/:id', courseController.courses_update_page);
router.get('/:id', courseController.courses_details);
router.put('/:id', courseController.courses_update);
router.delete('/:id', courseController.courses_delete);
router.get('/mass_add', courseController.courses_mass_add);

module.exports = router;