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
      required: true,
      min: 0,
      max: 100,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastSyncDate: {
      type: Date,
      default: null,
    },
    lastMaintenance: {
      type: Date,
      default: null,
    },
    nextMaintenance: {
      type: Date,
      default: null,
    },
    coil: {
      resistance: {
        type: Number,
        default: null, // en ohms
      },
      installedAt: {
        type: Date,
        default: null,
      },
      lifespan: {
        type: Number,
        default: null, // en jours
      }
    },
    hardwareInfo: {
      firmwareVersion: {
        type: String,
        default: '1.0.0',
      }
    },
    temperatureSettings: {
      current: {
        type: Number,
        default: 200, // en degrés Celsius
      },
      min: {
        type: Number,
        default: 100,
      },
      max: {
        type: Number,
        default: 300,
      },
    },
    warranty: {
      startDate: {
        type: Date,
        default: Date.now,
      },
      endDate: {
        type: Date,
        default: () => {
          const date = new Date();
          date.setFullYear(date.getFullYear() + 1);
          return date;
        },
      },
      isActive: {
        type: Boolean,
        default: true,
      },
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'repair', 'retired'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
vapeSchema.plugin(toJSON);
vapeSchema.plugin(paginate);

vapeSchema.statics.isCodeTaken = async function (code, excludeVapeId) {
  const vape = await this.findOne({ code, _id: { $ne: excludeVapeId } });
  return !!vape;
};

vapeSchema.statics.isSerialNumberTaken = async function (serialNumber, excludeVapeId) {
  const vape = await this.findOne({ serialNumber, _id: { $ne: excludeVapeId } });
  return !!vape;
};

const Vape = mongoose.model('Vape', vapeSchema);

module.exports = Vape;
