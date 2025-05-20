const httpStatus = require('http-status');
const { Consumption } = require('../models');
const ApiError = require('../utils/ApiError');

const SESSION_TIMEOUT = 10 * 60 * 1000; // 10 minutes en millisecondes

const recordPuff = async (userId, vapeId) => {
  // Vérifier si une session active existe
  const activeSession = await Consumption.findOne({
    userId,
    vapeId,
    isActive: true,
  }).sort({ startTime: -1 });

  let session;
  if (activeSession) {
    // Vérifier si la session doit être fermée (inactive depuis plus de 10 minutes)
    const now = new Date();
    const lastPuffTime = new Date(activeSession.endTime || activeSession.startTime);
    if (now - lastPuffTime > SESSION_TIMEOUT) {
      // Fermer l'ancienne session
      await Consumption.findByIdAndUpdate(
        activeSession._id,
        {
          isActive: false,
          endTime: lastPuffTime
        }
      );

      // Créer une nouvelle session
      session = await Consumption.create({
        userId,
        vapeId,
        startTime: now,
        endTime: now,
        puffCount: 1,
        isActive: true,
      });
    } else {
      // Mettre à jour la session existante
      session = await Consumption.findByIdAndUpdate(
        activeSession._id,
        {
          $inc: { puffCount: 1 },
          endTime: now,
        },
        { new: true }
      );
    }
  } else {
    // Créer une nouvelle session
    const now = new Date();
    session = await Consumption.create({
      userId,
      vapeId,
      startTime: now,
      endTime: now,
      puffCount: 1,
      isActive: true,
    });
  }

  return session;
};

const getConsumption = async (userId, vapeId) => {
  const sessions = await Consumption.find({ userId, vapeId })
    .populate({
      path: 'vapeId',
      select: 'batteryLevel serialNumber code'
    })
    .sort({ startTime: -1 })
    .limit(30);

  if (!sessions || sessions.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No consumption records found');
  }

  return sessions;
};

const getUserConsumptions = async (userId) => {
  return Consumption.find({ userId })
    .populate('vapeId')
    .sort({ startTime: -1 })
    .limit(30); // Limiter aux 30 dernières sessions
};

const getDailyStats = async (userId, vapeId, date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  const startOfYesterday = new Date(yesterday);
  startOfYesterday.setHours(0, 0, 0, 0);
  const endOfYesterday = new Date(yesterday);
  endOfYesterday.setHours(23, 59, 59, 999);

  // Inclure les sessions actives dans la recherche
  const todaySessions = await Consumption.find({
    userId,
    vapeId,
    $or: [
      { startTime: { $gte: startOfDay, $lte: endOfDay } },
      { isActive: true }
    ]
  }).populate('vapeId');

  const yesterdaySessions = await Consumption.find({
    userId,
    vapeId,
    startTime: { $gte: startOfYesterday, $lte: endOfYesterday }
  });

  const todayPuffs = todaySessions.reduce((sum, session) => sum + session.puffCount, 0);
  const yesterdayPuffs = yesterdaySessions.reduce((sum, session) => sum + session.puffCount, 0);

  let puffVariation = 0;
  if (yesterdayPuffs > 0) {
    puffVariation = Math.round(((todayPuffs - yesterdayPuffs) / yesterdayPuffs) * 100);
  } else if (todayPuffs > 0) {
    puffVariation = 100;
  }

  console.log('Daily Stats:', {
    todayPuffs,
    yesterdayPuffs,
    puffVariation,
    todaySessions: todaySessions.map(s => ({
      id: s._id,
      vapeId: s.vapeId,
      batteryLevel: s.vapeId?.batteryLevel,
      isActive: s.isActive,
      puffCount: s.puffCount
    }))
  });

  return {
    totalSessions: todaySessions.length,
    totalPuffs: todayPuffs,
    puffVariation,
    sessions: todaySessions
  };
};

module.exports = {
  recordPuff,
  getConsumption,
  getUserConsumptions,
  getDailyStats,
};
