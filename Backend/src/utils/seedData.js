const mongoose = require('mongoose');
const { Vape } = require('../models');
const logger = require('../config/logger');

const initialVapes = [
  {
    code: 'CLYPSE001',
    serialNumber: 'SN0001',
    model: 'Pro X',
    brand: 'Clyps',
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
    brand: 'Clyps',
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
    brand: 'Clyps',
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
    brand: 'Clyps',
    batteryLevel: 65,
    isActive: true,
    lastMaintenance: new Date('2024-03-10'),
    nextMaintenance: new Date('2024-06-10'),
    coil: null,
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
    brand: 'Clyps',
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
  {
    code: 'CLYPSE006',
    serialNumber: 'SN0006',
    model: 'Pro X Plus',
    brand: 'Clyps',
    batteryLevel: 75,
    isActive: true,
    lastMaintenance: new Date('2024-03-08'),
    nextMaintenance: new Date('2024-06-08'),
    coil: {
      resistance: 0.4,
      installedAt: new Date('2024-03-18'),
      lifespan: 10
    },
    hardwareInfo: {
      firmwareVersion: '2.2.0'
    },
    temperatureSettings: {
      current: 230,
      min: 100,
      max: 320,
    },
    warranty: {
      startDate: new Date('2024-02-20'),
      endDate: new Date('2025-02-20'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE007',
    serialNumber: 'SN0007',
    model: 'Air Max',
    brand: 'Clyps',
    batteryLevel: 45,
    isActive: true,
    lastMaintenance: new Date('2024-03-12'),
    nextMaintenance: new Date('2024-06-12'),
    coil: {
      resistance: 0.7,
      installedAt: new Date('2024-03-20'),
      lifespan: 18
    },
    hardwareInfo: {
      firmwareVersion: '2.1.5'
    },
    temperatureSettings: {
      current: 195,
      min: 100,
      max: 290,
    },
    warranty: {
      startDate: new Date('2024-02-25'),
      endDate: new Date('2025-02-25'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE008',
    serialNumber: 'SN0008',
    model: 'Mini Pro',
    brand: 'Clyps',
    batteryLevel: 30,
    isActive: true,
    lastMaintenance: new Date('2024-03-15'),
    nextMaintenance: new Date('2024-06-15'),
    coil: {
      resistance: 0.9,
      installedAt: new Date('2024-03-22'),
      lifespan: 16
    },
    hardwareInfo: {
      firmwareVersion: '2.0.8'
    },
    temperatureSettings: {
      current: 185,
      min: 100,
      max: 270,
    },
    warranty: {
      startDate: new Date('2024-03-01'),
      endDate: new Date('2025-03-01'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE009',
    serialNumber: 'SN0009',
    model: 'Starter Kit Plus',
    brand: 'Clyps',
    batteryLevel: 95,
    isActive: true,
    lastMaintenance: new Date('2024-03-18'),
    nextMaintenance: new Date('2024-06-18'),
    coil: {
      resistance: 1.2,
      installedAt: new Date('2024-03-25'),
      lifespan: 22
    },
    hardwareInfo: {
      firmwareVersion: '1.8.0'
    },
    temperatureSettings: {
      current: 175,
      min: 100,
      max: 240,
    },
    warranty: {
      startDate: new Date('2024-03-05'),
      endDate: new Date('2025-03-05'),
      isActive: true,
    },
    status: 'active',
  },
  {
    code: 'CLYPSE010',
    serialNumber: 'SN0010',
    model: 'Pro X Elite',
    brand: 'Clyps',
    batteryLevel: 80,
    isActive: true,
    lastMaintenance: new Date('2024-03-20'),
    nextMaintenance: new Date('2024-06-20'),
    coil: {
      resistance: 0.5,
      installedAt: new Date('2024-03-28'),
      lifespan: 12
    },
    hardwareInfo: {
      firmwareVersion: '2.3.0'
    },
    temperatureSettings: {
      current: 225,
      min: 100,
      max: 310,
    },
    warranty: {
      startDate: new Date('2024-03-10'),
      endDate: new Date('2025-03-10'),
      isActive: true,
    },
    status: 'active',
  }
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
