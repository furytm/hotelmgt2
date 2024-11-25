// routes/roomTypes.js

const express = require('express');
const { RoomType } = require('../models/roomType');
const authenticate = require('../middlewares/authenticate');
const authorizeAdmin = require('../middlewares/authorizeAdmin');

const router = express.Router();

// Create a new room type (Only accessible by admins)
router.post('/roomtypes', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    const existingRoomType = await RoomType.findOne({ name });
    if (existingRoomType) {
      return res.status(400).json({ message: 'Room type already exists.' });
    }

    const roomType = new RoomType({ name });
    await roomType.save();

    res.status(201).json({ message: 'Room type created successfully', roomType });
  } catch (err) {
    res.status(500).json({ message: 'Error creating room type', error: err.message });
  }
});

// Update an existing room type (Only accessible by admins)
router.put('/roomtypes/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const roomType = await RoomType.findById(id);
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found.' });
    }

    roomType.name = name || roomType.name;
    await roomType.save();

    res.status(200).json({ message: 'Room type updated successfully', roomType });
  } catch (err) {
    res.status(500).json({ message: 'Error updating room type', error: err.message });
  }
});

// Delete a room type (Only accessible by admins)
router.delete('/roomtypes/:id', authenticate, authorizeAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const roomType = await RoomType.findById(id);
    if (!roomType) {
      return res.status(404).json({ message: 'Room type not found.' });
    }

    await roomType.remove();

    res.status(200).json({ message: 'Room type deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting room type', error: err.message });
  }
});

module.exports = router;
