const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');


router.get('/me', authenticateToken, userController.getCurrentUser);

router.get('/', authenticateToken, authorizeRoles('admin'), userController.getAllUsers);

router.get('/:id', authenticateToken, userController.getUserById);

router.put('/:id', authenticateToken, userController.updateUser);

router.delete('/:id', authenticateToken, authorizeRoles('admin'), userController.deleteUser);

module.exports = router;
