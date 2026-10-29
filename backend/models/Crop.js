const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crop name is required'],
      trim: true,
    },

    type: {
      type: String,
      required: [true, 'Crop type is required'],
      trim: true,
    },

    plantingDate: {
      type: Date,
      required: [true, 'Planting date is required'],
    },

    area: {
      type: Number,
      required: [true, 'Farm area is required'],
      min: [0.01, 'Area must be greater than zero'],
    },

    areaUnit: {
      type: String,
      enum: ['ropani', 'kattha', 'bigha', 'acre', 'hectare'],
      default: 'ropani',
    },

    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Crop', cropSchema);