const express = require('express');
const mongoose = require('mongoose');
const Crop = require('../models/Crop');

const router = express.Router();

// GET: Fetch all crops
router.get('/', async (req, res) => {
try {
const crops = await Crop.find().sort({ createdAt: -1 });

res.status(200).json({
  success: true,
  count: crops.length,
  data: crops,
});


} catch (error) {
console.error('Fetch crops error:', error);

res.status(500).json({
success: false,
message: 'Failed to fetch crops',
error: error.message,
});
}

});

// GET: Fetch a single crop
router.get('/:id', async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({
success: false,
message: 'Invalid crop ID',
});
}


const crop = await Crop.findById(req.params.id);

if (!crop) {
  return res.status(404).json({
    success: false,
    message: 'Crop not found',
  });
}

res.status(200).json({
  success: true,
  data: crop,
});


} catch (error) {
res.status(500).json({
success: false,
message: 'Failed to fetch crop',
});
}
});

// POST: Add a new crop
router.post('/', async (req, res) => {
try {
const { name, type, plantingDate, area, areaUnit, notes } = req.body;

if (!name?.trim() || !type?.trim() || !plantingDate || area === undefined) {
  return res.status(400).json({
    success: false,
    message: 'Name, type, planting date and area are required',
  });
}

const crop = await Crop.create({
  name,
  type,
  plantingDate,
  area,
  areaUnit,
  notes,
});

res.status(201).json({
  success: true,
  message: 'Crop added successfully',
  data: crop,
});

} catch (error) {
res.status(400).json({
success: false,
message: error.message || 'Failed to add crop',
});
}
});

// PUT: Update a crop 
router.put('/:id', async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({
success: false,
message: 'Invalid crop ID',
});
}

const crop = await Crop.findByIdAndUpdate(
  req.params.id,
  req.body,
  {
    new: true,
    runValidators: true,
  }
);

if (!crop) {
  return res.status(404).json({
    success: false,
    message: 'Crop not found',
  });
}

res.status(200).json({
  success: true,
  message: 'Crop updated successfully',
  data: crop,
});

} catch (error) {
res.status(400).json({
success: false,
message: error.message || 'Failed to update crop',
});
}
});

// DELETE: Remove a crop
router.delete('/:id', async (req, res) => {
try {
if (!mongoose.isValidObjectId(req.params.id)) {
return res.status(400).json({
success: false,
message: 'Invalid crop ID',
});
}

const crop = await Crop.findByIdAndDelete(req.params.id);

if (!crop) {
  return res.status(404).json({
    success: false,
    message: 'Crop not found',
  });
}

res.status(200).json({
  success: true,
  message: 'Crop deleted successfully',
});

} catch (error) {
res.status(500).json({
success: false,
message: 'Failed to delete crop',
});
}
});

module.exports = router;