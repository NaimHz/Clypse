const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { consumptionService, vapeService } = require('../services');
const ApiError = require('../utils/ApiError');

const getUserConsumptions = catchAsync(async (req, res) => {
  const consumptions = await consumptionService.getUserConsumptions(req.user.id);
  res.send(consumptions);
});

const getVapeConsumption = catchAsync(async (req, res) => {
  const { vapeId } = req.params;

  const vape = await vapeService.getVapeById(vapeId);
  if (!vape || !vape.userId || !vape.userId.equals(req.user.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this vape');
  }

  const consumption = await consumptionService.getConsumption(req.user.id, vapeId);
  res.send(consumption);
});

const recordPuff = catchAsync(async (req, res) => {
  const { vapeId } = req.params;
  const userId = req.user.id;

  const session = await consumptionService.recordPuff(userId, vapeId);
  res.status(httpStatus.CREATED).send(session);
});

const getDailyStats = catchAsync(async (req, res) => {
  const { vapeId } = req.params;
  const { date } = req.query;
  const userId = req.user.id;

  const vape = await vapeService.getVapeById(vapeId);
  if (!vape || !vape.userId || !vape.userId.equals(req.user.id)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access to this vape');
  }

  const stats = await consumptionService.getDailyStats(userId, vapeId, date || new Date());
  res.send(stats);
});

module.exports = {
  getUserConsumptions,
  getVapeConsumption,
  recordPuff,
  getDailyStats,
};
