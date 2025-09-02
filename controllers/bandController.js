const Band = require('../models/band.model');

// Helper to check ownership
function isOwner(band, userId) {
  if (!band.createdBy) return false;
  if (typeof band.createdBy === 'object' && '_id' in band.createdBy) {
    return band.createdBy._id.toString() === userId;
  }
  return band.createdBy.toString() === userId;
}

// Create a band: logged-in user is the creator
async function createBand(req, res) {
  try {
    const userId = req.user.userId;
    const newBand = new Band({ ...req.body, createdBy: userId });
    await newBand.save();
    res.status(201).json(newBand);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get all bands: everyone can see all
async function getAllBands(req, res) {
  try {
    const bands = await Band.find().populate('createdBy', 'username');
    res.json(bands);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Get band by ID: everyone can see
async function getBandById(req, res) {
  try {
    const band = await Band.findById(req.params.id).populate('createdBy', 'username');
    if (!band) return res.status(404).json({ message: 'Band not found' });
    res.json(band);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Update band: admin or creator
async function updateBand(req, res) {
  try {
    const { userId, roles } = req.user;
    const band = await Band.findById(req.params.id).populate('createdBy', '_id');
    if (!band) return res.status(404).json({ message: 'Band not found' });

    if (!roles.includes('admin') && !isOwner(band, userId)) {
      return res.status(403).json({ message: 'Forbidden: You can only update your own bands' });
    }

    Object.assign(band, req.body);
    await band.save();
    res.json(band);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

// Delete band: admin or creator
async function deleteBand(req, res) {
  try {
    const { userId, roles } = req.user;
    const band = await Band.findById(req.params.id).populate('createdBy', '_id');
    if (!band) return res.status(404).json({ message: 'Band not found' });

    if (!roles.includes('admin') && !isOwner(band, userId)) {
      return res.status(403).json({ message: 'Forbidden: You can only delete your own bands' });
    }

    await band.deleteOne();
    res.json({ message: 'Band deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = {
  createBand,
  getAllBands,
  getBandById,
  updateBand,
  deleteBand,
};
