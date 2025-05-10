const express = require('express');
const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver
} = require('../controllers/driverController');
const { protect, isSuperAdmin, isSuperOrAdmin, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getAllDrivers); // Example: Add middleware
router.get('/:id', protect, getDriverById);
router.post('/', protect, isAdmin, createDriver); // Example: Restrict to admins
router.put('/:id', protect, isAdmin, updateDriver);
router.delete('/:id', protect, isAdmin, deleteDriver);

module.exports = router;