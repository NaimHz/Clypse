const mongoose = require('mongoose');
const { Vape } = require('../models');
const logger = require('../config/logger');

const initialVapes = [
  {
    code: 'CLYPSE001',
    serialNumber: 'SN0001',
    model: 'Pro X',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
    lastMaintenance: new Date('2024-03-01'),
    nextMaintenance: new Date('2024-06-01'),
    coil: {
      resistance: 0.6,
      installedAt: new Date('2024-03-15'),
      lifespan: 15
    },
    hardwareInfo: {
      firmwareVersion: '2.1.0'
    },
    temperatureSettings: {
      current: 220,
      min: 100,
      max: 300,
    },
    warranty: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2025-01-01'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE002',
    serialNumber: 'SN0002',
    model: 'Air',
    brand: 'Clypse',
    batteryLevel: 85,
    isActive: true,
    lastMaintenance: new Date('2024-02-15'),
    nextMaintenance: new Date('2024-05-15'),
    coil: {
      resistance: 0.8,
      installedAt: new Date('2024-03-10'),
      lifespan: 12
    },
    hardwareInfo: {
      firmwareVersion: '2.0.5'
    },
    temperatureSettings: {
      current: 200,
      min: 100,
      max: 280,
    },
    warranty: {
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-15'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE003',
    serialNumber: 'SN0003',
    model: 'Starter Kit',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
    lastMaintenance: null,
    nextMaintenance: new Date('2024-07-01'),
    coil: {
      resistance: 1.0,
      installedAt: new Date('2024-03-01'),
      lifespan: 20
    },
    hardwareInfo: {
      firmwareVersion: '1.5.0'
    },
    temperatureSettings: {
      current: 180,
      min: 100,
      max: 250,
    },
    warranty: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2025-02-01'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE004',
    serialNumber: 'SN0004',
    model: 'Mini',
    brand: 'Clypse',
    batteryLevel: 65,
    isActive: true,
    lastMaintenance: new Date('2024-03-10'),
    nextMaintenance: new Date('2024-06-10'),
    coil: null, // Pas de résistance connectée
    hardwareInfo: {
      firmwareVersion: '2.0.0'
    },
    temperatureSettings: {
      current: 190,
      min: 100,
      max: 260,
    },
    warranty: {
      startDate: new Date('2024-01-20'),
      endDate: new Date('2025-01-20'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE005',
    serialNumber: 'SN0005',
    model: 'Pro X',
    brand: 'Clypse',
    batteryLevel: 90,
    isActive: true,
    lastMaintenance: new Date('2024-03-05'),
    nextMaintenance: new Date('2024-06-05'),
    coil: {
      resistance: 0.6,
      installedAt: new Date('2024-03-12'),
      lifespan: 14
    },
    hardwareInfo: {
      firmwareVersion: '2.1.0'
    },
    temperatureSettings: {
      current: 210,
      min: 100,
      max: 300,
    },
    warranty: {
      startDate: new Date('2024-02-15'),
      endDate: new Date('2025-02-15'),
      isActive: true,
    },
    status: 'active',
  },
];

const generateUniqueVapeCode = () => {
  const randomDigits = Math.floor(Math.random() * 900) + 100; // Nombre entre 100 et 999
  return `CLYPSE${randomDigits}`;
};

const seedVapes = async () => {
  try {
    // Vérifier si les vapes initiales existent déjà
    const existingVapes = await Vape.find({
      code: { $in: initialVapes.map(v => v.code) }
    });

    if (existingVapes.length === 0) {
      logger.info('Seeding default vapes to the database...');
      await Vape.insertMany(initialVapes);
      logger.info('Default vapes seeded successfully');
    } else {
      logger.info(`Found ${existingVapes.length} existing vapes, skipping seed`);
    }
  } catch (error) {
    logger.error('Error seeding vapes:', error);
    throw error; // Propager l'erreur pour la gérer au niveau supérieur
  }
};

module.exports = {
  seedVapes,
  generateUniqueVapeCode,
};
