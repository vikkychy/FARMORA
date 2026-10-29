const express = require('express');
const mongoose = require('mongoose');
const Crop = require('../models/Crop');

const router = express.Router();
const cropFields = ['name', 'type', 'plantingDate', 'area', 'areaUnit', 'notes'];

function getCropFields(body = {}) {
  return Object.fromEntries(
    cropFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function hasRequiredCropFields(crop) {
  return (
    typeof crop.name === 'string' &&
    crop.name.trim().length > 0 &&
    typeof crop.type === 'string' &&
    crop.type.trim().length > 0 &&
    Boolean(crop.plantingDate) &&
    crop.area !== undefined &&
    crop.area !== ''
  );
}

// GET: Fetch all crops for the dashboard and crop list.
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

// GET: Fetch a single crop.
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid crop ID' });
    }

    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    return res.status(200).json({ success: true, data: crop });
  } catch (error) {
    console.error('Fetch crop error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch crop' });
  }
});

// POST: Add a crop using the fields shown in the UI form.
router.post('/', async (req, res) => {
  try {
    const cropFieldsFromUi = getCropFields(req.body);
    if (!hasRequiredCropFields(cropFieldsFromUi)) {
      return res.status(400).json({
        success: false,
        message: 'Name, type, planting date and area are required',
      });
    }

    const crop = await Crop.create(cropFieldsFromUi);
    return res.status(201).json({
      success: true,
      message: 'Crop added successfully',
      data: crop,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to add crop',
    });
  }
});

// PUT: Update only fields that can be edited in the UI.
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid crop ID' });
    }

    const updates = getCropFields(req.body);
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Provide at least one crop field to update',
      });
    }

    const crop = await Crop.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Crop updated successfully',
      data: crop,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Failed to update crop',
    });
  }
});

// DELETE: Remove a crop.
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid crop ID' });
    }

    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({ success: false, message: 'Crop not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Crop deleted successfully',
    });
  } catch (error) {
    console.error('Delete crop error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete crop' });
  }
});

module.exports = router;
