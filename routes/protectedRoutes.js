const { authenticateToken } = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();

router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have access!` });
});

module.exports = router;
