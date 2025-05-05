const mongoose = require('mongoose');
const { Vape } = require('../models');
const logger = require('../config/logger');

/**
 * Données initiales des vapes
 */
const initialVapes = [
  {
    code: 'CLYPSE001',
    serialNumber: 'SN0001',
    model: 'Pro X',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
  },
  {
    code: 'CLYPSE002',
    serialNumber: 'SN0002',
    model: 'Air',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
  },
  {
    code: 'CLYPSE003',
    serialNumber: 'SN0003',
    model: 'Starter Kit',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
  },
  {
    code: 'CLYPSE004',
    serialNumber: 'SN0004',
    model: 'Mini',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
  },
  {
    code: 'CLYPSE005',
    serialNumber: 'SN0005',
    model: 'Pro X',
    brand: 'Clypse',
    batteryLevel: 100,
    isActive: true,
  },
];

/**
 * Génère un code unique pour les vapes
 * Format: CLYPSE suivi de 3 chiffres aléatoires
 * @returns {string} Le code unique généré
 */
const generateUniqueVapeCode = () => {
  const randomDigits = Math.floor(Math.random() * 900) + 100; // Nombre entre 100 et 999
  return `CLYPSE${randomDigits}`;
};

/**
 * Fonction pour initialiser les vapes par défaut
 */
const seedVapes = async () => {
  try {
    // Vérifier si des vapes existent déjà
    const count = await Vape.countDocuments();

    if (count === 0) {
      logger.info('Seeding default vapes to the database...');
      await Vape.insertMany(initialVapes);
      logger.info('Default vapes seeded successfully');
    } else {
      logger.info('Skipping vape seeding: database already contains vapes');
    }
  } catch (error) {
    logger.error('Error seeding vapes:', error);
  }
};

module.exports = {
  seedVapes,
  generateUniqueVapeCode,
};
