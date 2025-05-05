const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const vapeSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    serialNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    brand: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      default: null,
    },
    linkedAt: {
      type: Date,
      default: null,
    },
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
      default: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
vapeSchema.plugin(toJSON);
vapeSchema.plugin(paginate);

/**
 * Check if code is already taken
 * @param {string} code - The vape's unique code
 * @param {ObjectId} [excludeVapeId] - The id of the vape to be excluded
 * @returns {Promise<boolean>}
 */
vapeSchema.statics.isCodeTaken = async function (code, excludeVapeId) {
  const vape = await this.findOne({ code, _id: { $ne: excludeVapeId } });
  return !!vape;
};

/**
 * Check if serial number is already taken
 * @param {string} serialNumber - The vape's serial number
 * @param {ObjectId} [excludeVapeId] - The id of the vape to be excluded
 * @returns {Promise<boolean>}
 */
vapeSchema.statics.isSerialNumberTaken = async function (serialNumber, excludeVapeId) {
  const vape = await this.findOne({ serialNumber, _id: { $ne: excludeVapeId } });
  return !!vape;
};

/**
 * @typedef Vape
 */
const Vape = mongoose.model('Vape', vapeSchema);

module.exports = Vape;
