const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const bandController = require('../controllers/bandController');

router.get('/', authenticateToken, bandController.getAllBands);
router.get('/:id', authenticateToken, bandController.getBandById);
router.post('/', authenticateToken, bandController.createBand);
router.put('/:id', authenticateToken, bandController.updateBand);
router.delete('/:id', authenticateToken, bandController.deleteBand);

module.exports = router;
