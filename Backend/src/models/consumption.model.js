const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const consumptionSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    vapeId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Vape',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      default: null,
    },
    puffCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

// Index pour faciliter les requêtes de statistiques
consumptionSchema.index({ userId: 1, vapeId: 1, isActive: 1 });
consumptionSchema.index({ userId: 1, startTime: -1 });
consumptionSchema.index({ vapeId: 1, startTime: -1 });

// add plugin that converts mongoose to json
consumptionSchema.plugin(toJSON);
consumptionSchema.plugin(paginate);

/**
 * @typedef Consumption
 */
const Consumption = mongoose.model('Consumption', consumptionSchema);

module.exports = Consumption;
