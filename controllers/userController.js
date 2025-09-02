const User = require('../models/user.model');

exports.getAllUsers = async (req, res) => {
  try {
    // Only the admin can see all the users
    if (!req.user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const isAdmin = req.user.roles.includes('admin');
    const isOwner = req.user.userId === req.params.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const isAdmin = req.user.roles.includes('admin');
    const isOwner = req.user.userId === req.params.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }


    if (!isAdmin) {
      delete req.body.roles;
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const isAdmin = req.user.roles.includes('admin');
    const isOwner = req.user.userId === req.params.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCurrentUser = (req, res) => {
  try {
    // req.user is set by authenticateToken middleware
    res.json({
      userId: req.user.userId,
      username: req.user.username,
      roles: req.user.roles,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
